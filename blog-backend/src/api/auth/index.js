import * as authCtrl from './auth.ctrl';
import Router from 'koa-router';

const authApi = new Router();

authApi.post('/register', authCtrl.register);
authApi.post('/login', authCtrl.login);
authApi.get('/check', authCtrl.check);
authApi.post('/logout', authCtrl.logout);

export default authApi;
