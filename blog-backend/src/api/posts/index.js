import Router from 'koa-router';
import checkLoggedIn from '../../lib/checkLoggedIn';
import * as postsCtrl from './posts.ctrl';

const postsApi = new Router();

const printInfo = (ctx) => {
  ctx.body = {
    method: ctx.method,
    path: ctx.path,
    params: ctx.params,
  };
};

postsApi.get('/', postsCtrl.list);
//두번째 매개변수로 미들웨어를 넘겨줌으로써 미들웨어를 거치도록 한다.
postsApi.post('/', checkLoggedIn, postsCtrl.write);

// postsApi.get('/:id', postsCtrl.read);
// postsApi.delete('/:id', postsCtrl.remove);
// postsApi.patch('/:id', postsCtrl.update);

//미사용
// postsApi.put('/:id', postsCtrl.replace);

const postIdApi = new Router();
postIdApi.get('/', postsCtrl.read);
//포스트를 가져오는 미들웨어 이후에 해당 포스트가 작성자의 포스트인지 체크하는 미들웨어 실행
postIdApi.delete('/', checkLoggedIn, postsCtrl.checkOwnPost, postsCtrl.remove);
postIdApi.patch('/', checkLoggedIn, postsCtrl.checkOwnPost, postsCtrl.update);

//라우터 내부의 라우터 url 은 /post/:id 가 된다.
postsApi.use('/:id', postsCtrl.getPostById, postIdApi.routes());

export default postsApi;
