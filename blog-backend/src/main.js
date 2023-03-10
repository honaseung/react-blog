require('dotenv').config();
import Koa from 'koa';
import Router from 'koa-router';
// const api = require('./api');
import postApi from './api/posts';
import bodyParser from 'koa-bodyparser';
import mongoose from 'mongoose';
// import createFakeData from './createFakeData';
import authApi from './api/auth';
import jwtMiddleware from './lib/jwtMiddleware';
import serve from 'koa-static';
import path from 'path';
import send from 'koa-send';

const { PORT, MONGO_URI } = process.env;

mongoose
  .connect(MONGO_URI)
  .then(() => {
    console.log('Connect to MongoDB');
    //페이지네이션 구현을 위한 더미 데이터 생성용 함수
    // createFakeData();
  })
  .catch((e) => console.log('Fail to connect', e));

//서버 생성
const app = new Koa();
const router = new Router();

//라우터 등록 전에 해줘야한다.
app.use(bodyParser());
//라우터 등록 전에 해줘야한다.
app.use(jwtMiddleware);

// //api 라는 폴더의 index.js 에서 가져온 라우터 등록
// //해당하는 모든 라우터들은 경로가 반드시 /api 부터 시작해야한다.
// router.use('/api', api.routes());
router.use('/api/post', postApi.routes());
router.use('/api/auth', authApi.routes());

// //라우터 설정
// //첫번째 파라미터는 경로, 두번째 파라미터는 미들웨어에서 사용할 함수
// router.get('/', (ctx) => {
//   ctx.body = '홈';
// });

// //경로에 파라미터를 주입함, 파라미터 뒤에 ? 를 붙일시에 파라미터가 필수값이 아니게됨.
// router.get('/about/:name?', (ctx) => {
//   //파람으로 가져오려면 /about/test 형태를 띄어야함.
//   const { name } = ctx.params;
//   ctx.body = name ? `${name} 의 소개` : '소개';
// });

// router.get('/posts', (ctx) => {
//   //쿼리로 가져오려면 /posts?id=1 처럼 쿼리스트링이 되면 됨.
//   //쿼리로 가져오면 자동으로 객체로 만들어줌, 그게 싫다면 queryString 을 사용할 것.
//   const { id } = ctx.query;
//   ctx.body = id ? `포스트 #${id}` : '포소트 아이디가 없습니다.';
// });

// //미들웨어
// //ctx = Context 의 줄임말로써 웹 요청과 응답에 관한 정보를 가지고있음.
// app.use(async (ctx, next) => {
//   ctx.body = "I'm here";
//   await next();
// });

//서버 (next 가 없으니까)
app.use(router.routes()).use(router.allowedMethods());
const builDirectory = path.resolve(__dirname, '../../blog-frontend/build');
app.use(serve(builDirectory));
app.use(async (ctx) => {
  if (ctx.status === 404 && ctx.path.indexOf('/api') !== 0) {
    await send(ctx, 'index.html', { root: builDirectory });
  }
});

//서버 포트 4000 번으로 띄우기
//PORT 로 지정해주는데 PORT 값이 유효하지 않으면 4000 으로 지정
const port = PORT || 4000;
app.listen(port, () => {
  console.log(`listen ${port}`);
});
