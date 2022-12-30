let postId = 1;

const posts = [
  {
    id: 1,
    title: '제목',
    body: '내용',
  },
];

//포스트 작성
exports.write = (ctx) => {
  const { title, body } = ctx.request.body;
  postId += 1;
  const post = { id: postId, title, body };
  posts.push(post);
  ctx.body = post;
};

//포스트 목록 조회
exports.list = (ctx) => {
  ctx.body = posts;
};

//포토스 조회
exports.read = (ctx) => {
  const { id } = ctx.params;
  //파람으로 받아온 값은 항상 문자열이다.
  const post = posts.find((post) => post.id.toString() === id);
  if (!post) {
    //오류로 간주하기위해 status 값을 변경
    ctx.status = 404;
    ctx.body = {
      message: '해당 포스트가 없습니다.',
    };
    return;
  }
  ctx.body = post;
};

//포스트 삭제
exports.remove = (ctx) => {
  const { id } = ctx.params;
  const targetPostIdx = posts.findIndex((post) => post.id.toString() === id);
  if (targetPostIdx === -1) {
    ctx.status = 404;
    ctx.body = {
      message: '삭제할 포스트가 없습니다.',
    };
    return;
  }
  posts.splice(targetPostIdx, 1);
  //성공하고 상태값만 변경
  ctx.status = 204;
};

//포스트 수정
exports.replace = (ctx) => {
  // id 만을 url 파람으로 보내는 중
  const { id } = ctx.params;
  const targetPostIdx = posts.findIndex((post) => post.id === id);
  if (targetPostIdx === -1) {
    ctx.status = 404;
    ctx.body = {
      message: '수정할 포스트가 없습니다.',
    };
    return;
  }
  posts[targetPostIdx] = {
    id,
    //바디로 들어오는 파람
    ...ctx.request.body,
  };
  //수정완료된 대상만 보여주기
  ctx.body = posts[targetPostIdx];
};

//포스트 특정 값만 변경
exports.update = (ctx) => {
  const { id } = ctx.params;
  const targetIndex = posts.findIndex((post) => post.id === id);
  if (targetIndex === -1) {
    ctx.statue = 404;
    ctx.body = {
      message: '수정할 대상이 없습니다.',
    };
  }
  posts[targetIndex] = {
    ...posts[targetIndex],
    ...ctx.request.body,
  };
  ctx.body = posts[targetIndex];
};
