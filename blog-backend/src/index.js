const Koa = require('koa');

//서버 생성
const app = new Koa();

//미들웨어 처리
app.use(async (ctx, next) => {
  console.log(ctx.url);
  console.log(1);
  //쿼리 파라미터중 authorized 가 '1' 인지
  if (ctx.query.authorized !== '1') {
    ctx.statud = 401;
    return;
  }
  //다음 미들웨어 처리
  await next();
  console.log('END');
});

app.use((ctx, next) => {
  console.log(2);
  ctx.body = "I'm here";
  next();
});

//서버(next 가 없으니까)
app.use((ctx) => {
  ctx.body += '\nhello world';
});

//서버 포트 4000 번으로 띄우기
app.listen(4000, () => {
  console.log('listen 4000');
});
