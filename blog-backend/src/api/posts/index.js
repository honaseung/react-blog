const Router = require('koa-router');
const postsCtrl = require('./posts.ctrl');

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
postsApi.get('/:id', postsCtrl.read);
postsApi.delete('/:id', postsCtrl.remove);
postsApi.put('/:id', postsCtrl.replace);
postsApi.patch('/:id', postsCtrl.update);

module.exports = postsApi;
