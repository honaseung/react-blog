import Post from '../../models/post';
import mongoose from 'mongoose';

//DB 에 해싱되어 저장되어 있는 ID 값으로써 유효한지 검증하는 함수
const { ObjectId } = mongoose.Types;

export const checkObjectId = (ctx, next) => {
  const { id } = ctx.params;
  if (!ObjectId.isValid(id)) {
    //ID 값이 유효하지 않다면 ID 값을 잘못 넘겨준 클라이언트 오류로 판단
    ctx.status = 400;
    return;
  }
  return next();
};

//데이터 추가
export const write = async (ctx) => {
  const { title, body, tags } = ctx.request.body;
  //추가해줄 내용을 객체형 파라미터로 넘겨서 스키마 객체 생성후
  const post = new Post({
    title,
    body,
    tags,
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
  try {
    //조회시에는 단순히 함수만 호출하는것이 아니라 함수 호출후에 exec 함수를 한번 더 호출 시켜줘야한다.
    const post = await Post.find().exec();
    ctx.body = post;
  } catch (error) {
    ctx.throw(500, error);
  }
};

//단건 조회
export const read = async (ctx) => {
  //여기서 사용하는 id 값은 DB 에 저장되어 있는 일종의 해싱된 값 형태이다.
  const { id } = ctx.params;
  try {
    const post = await Post.findById(id).exec();
    if (!post) {
      ctx.status = 404;
      return;
    }
    ctx.body = post;
  } catch (error) {
    ctx.throw(500, error);
  }
};

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

//단건 수정
export const update = async (ctx) => {
  const { id } = ctx.params;
  try {
    //id 값만 url 로 받고 나머진 바디로 받는다.
    const post = await Post.findByIdAndUpdate(id, ctx.request.body, {
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
