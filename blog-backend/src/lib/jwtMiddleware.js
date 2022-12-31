import jwt from 'jsonwebtoken';
import User from '../models/user';

const jwtMiddleware = async (ctx, next) => {
  const token = ctx.cookies.get('access_token');
  if (!token) return next();
  try {
    //토근을 토큰 비밀키로 검증하기
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    //미들웨어에서 사용할 수 있도록 state 에 저장
    ctx.state.user = {
      _id: decoded._id,
      username: decoded.username,
    };
    //Date.now 호출시 현재시간이 밀리세컨드로 리턴된다.
    const now = Math.floor(Date.now() / 1000);
    //exp 의 값이 밀리세컨드 기준이 아닌 1초 기준
    if (decoded.exp - now < 60 * 60 * 24 * 3.5) {
      //현재 로그인한 user 정보를 _id 값으로 가져오기
      const user = await User.findById(decoded._id);
      //토근 재발행
      const token = user.generateToken();
      ctx.cookies.set('access_token', token, {
        maxAge: 1000 * 60 * 60 * 24 * 7,
        httpOnly: true,
      });
    }
    return next();
  } catch (error) {
    return next();
  }
};

export default jwtMiddleware;
