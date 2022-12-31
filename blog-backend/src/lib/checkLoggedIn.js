const checkLoggedIn = (ctx, next) => {
  //user 정보가 없을시 진행하지 않는다.
  if (!ctx.state.user) {
    ctx.status = 401;
    return;
  }
  return next();
};

export default checkLoggedIn;
