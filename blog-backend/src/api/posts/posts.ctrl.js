import Post from '../../models/post';
import mongoose from 'mongoose';
import Joi, { array, string } from 'joi';
import sanitizeHtml from 'sanitize-html';

//DB 에 해싱되어 저장되어 있는 ID 값으로써 유효한지 검증하는 함수
const { ObjectId } = mongoose.Types;

const DOCUMENT_PER_PAGE = 10;

const sanitizeOption = {
  allowedTags: [
    'h1',
    'h2,',
    'b',
    'i',
    'u',
    's',
    'p',
    'ul',
    'ol',
    'li',
    'blockquote',
    'a',
    'img',
  ],
  allowedAttributes: {
    a: ['href', 'name', 'target'],
    img: ['src'],
    li: ['class'],
  },
  allowedSchemes: ['data', 'http'],
};

const removeHtmlAndShorten = (body) => {
  const filtered = sanitizeHtml(body, {
    allowedTags: [],
  });
  return filtered.length < 200 ? filtered : `${filtered.slice(0, 200)}...`;
};

//ID 체크하는 함수에서 Post 를 가져오는 함수로 변경
//ID 체크도 여전히 하고 있다.
export const getPostById = async (ctx, next) => {
  const { id } = ctx.params;
  if (!ObjectId.isValid(id)) {
    //ID 값이 유효하지 않다면 ID 값을 잘못 넘겨준 클라이언트 오류로 판단
    ctx.status = 400;
    return;
  }
  try {
    const post = await Post.findById(id);
    if (!post) {
      ctx.status = 404;
      return;
    }
    ctx.state.post = post;
    return next();
  } catch (error) {
    ctx.throw(500, error);
  }
};

//읽어온 포스트의 작성자인지 여부 판단
export const checkOwnPost = (ctx, next) => {
  //post 정보는 미들웨어에서 user 정보는 로그인시에 생성된다.
  const { post, user } = ctx.state;
  //_id 값으로 비교한다. 이때 다큐먼트 쪽의 값은 항상 toString() 을 해줘야한다.
  if (post.user._id.toString() !== user._id) {
    ctx.status = 403;
    return;
  }
  return next();
};

//데이터 추가
export const write = async (ctx) => {
  //검증을 위한 객체 생성
  const schema = Joi.object().keys({
    //문자열이고 필수값인지
    title: Joi.string().required(),
    body: Joi.string().required(),
    //문자열로 이루어진 배열
    tags: Joi.array().items(Joi.string()).required(),
  });
  //검증
  const result = schema.validate(ctx.request.body);
  if (result.error) {
    ctx.status = 400;
    ctx.body = result.error;
    return;
  }

  const { title, body, tags } = ctx.request.body;
  //user 정보 가져오기
  const { user } = ctx.state;
  //추가해줄 내용을 객체형 파라미터로 넘겨서 스키마 객체 생성후
  const post = new Post({
    title,
    body: sanitizeHtml(body, sanitizeOption),
    tags,
    //user 정보 추가하기
    user,
  });
  //await 구문을 사용시에는 항상 try/catch 를 해준다.
  try {
    //생성된 인스턴스의 save 함수 호출로 인스턴스가 갖고있는 정보를 DB 에 저장
    await post.save();
    ctx.body = post;
  } catch (error) {
    //500 으로 서버 에러를 띄워줌
    ctx.throw(500, error);
  }
};

//전체 조회
export const list = async (ctx) => {
  const page = parseInt(ctx.query.page || '1', 10);
  if (page < 1) {
    ctx.status = 400;
    return;
  }
  const { tag, username } = ctx.query;
  const query = {
    //값이 유효한지 확인하고 넣어준다. 그렇지 않으면 조회시 항상 검색 조건을 넣어야만 한다.
    //키 이름에 '.' 이 들어가면 javascript 에서 user 라는 변수 또는 객체를 찾으려고 하기에 문자열로 넣어준다.
    ...(username ? { 'user.username': username } : {}),
    ...(tag ? { tags: tag } : {}),
  };
  try {
    //조회시에는 단순히 함수만 호출하는것이 아니라 함수 호출후에 exec 함수를 한번 더 호출 시켜줘야한다.
    //정렬할 필드명은 DB 에서 리턴되는 다큐먼트의 필드를 참고하기
    const post = await Post.find()
      .sort({ _id: -1 })
      //'DOCUMENT_PER_PAGE' 개씩 가져오기
      .limit(DOCUMENT_PER_PAGE)
      //순서대로 들어온 데이터 중 몇개를 무시할지
      .skip((page - 1) * DOCUMENT_PER_PAGE)
      //조회 리턴값이 JSON 배열이 된다. 단건이면 그냥 JSON 이던가
      .lean()
      .exec();
    //스키마를 통해 DB 에 저장된 다큐먼트의 총 개수를 가져오기
    const postCount = await Post.countDocuments(query).exec();
    //한 페이지당 보여줄 갯수로 전체를 나누어서 마지막 페이지를 구하기
    //ctx.set 호출하여 커스텀 HTTP 헤더를 첫번째 매개변수로 키 설정, 두번째 매개변수로 값 설정
    ctx.set('Last-Page', Math.ceil(postCount / DOCUMENT_PER_PAGE));
    ctx.body = post
      //다큐먼트 각각을 JSON 형태로 변경
      //lean 을 호출하면 필요없어진다.
      // .map((post) => post.toJSON())
      .map((post) => ({
        ...post,
        body:
          //HTML 제거하고 200 자가 넘으면 200자를 자르고 그 뒤를 '...' 으로 처리
          removeHtmlAndShorten(post.body),
      }));
  } catch (error) {
    ctx.throw(500, error);
  }
};

//기존에는 실제 조회를 통해 포스트를 가져 왔지만, 변경된 함수는 미들웨어에서 post 를 미리 가져온다.
export const read = (ctx) => {
  ctx.body = ctx.state.post;
};

//단건 조회
// export const read = async (ctx) => {
//   //여기서 사용하는 id 값은 DB 에 저장되어 있는 일종의 해싱된 값 형태이다.
//   const { id } = ctx.params;
//   try {
//     const post = await Post.findById(id).exec();
//     if (!post) {
//       ctx.status = 404;
//       return;
//     }
//     ctx.body = post;
//   } catch (error) {
//     ctx.throw(500, error);
//   }
// };

//단건 삭제
export const remove = async (ctx) => {
  const { id } = ctx.params;
  try {
    //조회와 동일하게 함수 호출후 exec 를 한번 더 호출
    await Post.findByIdAndRemove(id).exec();
    //응답할 데이터가 없다.
    ctx.status = 204;
    ctx.body = id;
  } catch (error) {
    ctx.throw(500, error);
  }
};

// export const replace = (ctx) => {};

function validate(body) {
  if (
    typeof body.title === 'string' &&
    typeof body.body === 'string' &&
    body.tags instanceof Array
  )
    return true;
  return false;
}

//단건 수정
export const update = async (ctx) => {
  //검증을 위한 객체 생성
  //Joi 라이브러리에 버그가 있어서 막음
  // const schema = Joi.object().keys({
  //   //str 타입을 검증 해줄것이기에 숫자를 넘겨주면 에러가 날 것같지만 자동으로 형변환을 해주어 에러가 발생하지 않는다.
  //   title: string(),
  //   body: string(),
  //   tags: array().items(string()),
  // });
  //검증
  const result = validate(ctx.request.body);
  // if (result.error) {
  //   ctx.status = 400;
  //   ctx.body = result.error;
  //   return;
  // }
  if (!result) {
    ctx.status = 400;
    ctx.body = '데이터 타입 오류입니다.';
    return;
  }

  const { id } = ctx.params;
  const nextData = { ...ctx.request.body };
  if (nextData.body) {
    nextData.body = sanitizeHtml(nextData.body, sanitizeOption);
  }
  try {
    //id 값만 url 로 받고 나머진 바디로 받는다.
    const post = await Post.findByIdAndUpdate(id, nextData, {
      //수정된 데이터를 리턴할지 여부, false 일시 수정 이전 데이터가 리턴된다.
      new: true,
    }).exec();
    if (!post) {
      ctx.status = 404;
      return;
    }
    ctx.body = post;
  } catch (error) {
    ctx.throw(500, error);
  }
};

// let postId = 1;

// const posts = [
//   {
//     id: 1,
//     title: '제목',
//     body: '내용',
//   },
// ];

// //포스트 작성
// export const write = (ctx) => {
//   const { title, body } = ctx.request.body;
//   postId += 1;
//   const post = { id: postId, title, body };
//   posts.push(post);
//   ctx.body = post;
// };

// //포스트 목록 조회
// export const list = (ctx) => {
//   ctx.body = posts;
// };

// //포토스 조회
// export const read = (ctx) => {
//   const { id } = ctx.params;
//   //파람으로 받아온 값은 항상 문자열이다.
//   const post = posts.find((post) => post.id.toString() === id);
//   if (!post) {
//     //오류로 간주하기위해 status 값을 변경
//     ctx.status = 404;
//     ctx.body = {
//       message: '해당 포스트가 없습니다.',
//     };
//     return;
//   }
//   ctx.body = post;
// };

// //포스트 삭제
// export const remove = (ctx) => {
//   const { id } = ctx.params;
//   const targetPostIdx = posts.findIndex((post) => post.id.toString() === id);
//   if (targetPostIdx === -1) {
//     ctx.status = 404;
//     ctx.body = {
//       message: '삭제할 포스트가 없습니다.',
//     };
//     return;
//   }
//   posts.splice(targetPostIdx, 1);
//   //성공하고 상태값만 변경
//   ctx.status = 204;
// };

// //포스트 수정
// export const replace = (ctx) => {
//   // id 만을 url 파람으로 보내는 중
//   const { id } = ctx.params;
//   const targetPostIdx = posts.findIndex((post) => post.id === id);
//   if (targetPostIdx === -1) {
//     ctx.status = 404;
//     ctx.body = {
//       message: '수정할 포스트가 없습니다.',
//     };
//     return;
//   }
//   posts[targetPostIdx] = {
//     id,
//     //바디로 들어오는 파람
//     ...ctx.request.body,
//   };
//   //수정완료된 대상만 보여주기
//   ctx.body = posts[targetPostIdx];
// };

// //포스트 특정 값만 변경
// export const update = (ctx) => {
//   const { id } = ctx.params;
//   const targetIndex = posts.findIndex((post) => post.id === id);
//   if (targetIndex === -1) {
//     ctx.statue = 404;
//     ctx.body = {
//       message: '수정할 대상이 없습니다.',
//     };
//   }
//   posts[targetIndex] = {
//     ...posts[targetIndex],
//     ...ctx.request.body,
//   };
//   ctx.body = posts[targetIndex];
// };
