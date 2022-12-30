import Router from 'koa-router';
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
postsApi.post('/', postsCtrl.write);

// postsApi.get('/:id', postsCtrl.read);
// postsApi.delete('/:id', postsCtrl.remove);
// postsApi.patch('/:id', postsCtrl.update);

//미사용
// postsApi.put('/:id', postsCtrl.replace);

const postIdApi = new Router();
postIdApi.get('/', postsCtrl.read);
postIdApi.delete('/', postsCtrl.remove);
postIdApi.patch('/', postsCtrl.update);

//라우터 내부의 라우터 url 은 /post/:id 가 된다.
postsApi.use('/:id', postsCtrl.checkObjectId, postIdApi.routes());

export default postsApi;
