import Joi from 'joi';
import User from '../../models/user';

export const register = async (ctx) => {
  //회원가입
  const schema = Joi.object().keys({
    username: Joi.string()
      //숫자 또는 알파벳
      .alphanum()
      //최소 자리수
      .min(3)
      //최대 자리수
      .max(20)
      .required(),
    password: Joi.string().required(),
  });
  const result = schema.validate(ctx.request.body);
  if (result.error) {
    ctx.status = 400;
    ctx.body = result.error;
    return;
  }

  const { username, password } = ctx.request.body;
  try {
    //스키마에 username 과 동일한 다큐먼트 가져오기
    const exist = await User.findByUsername(username);
    //이미 존재하기에
    if (exist) {
      ctx.status = 409;
      ctx.body = '중복된 이름입니다.';
      return;
    }
    //password 는 해싱된 값을 이용해야하므로
    const user = new User({
      username,
    });
    //password 해싱시켜서 세팅해주기
    await user.setPassword(password);
    //DB 에 저장하기, 저장에는 exec() 를 호출하지 않는다.
    await user.save();

    //리턴될때 password 가 노출되지 않도록 JSON 객체에서 제거해주기
    ctx.body = user.serialize();
    //토큰 생성
    const token = user.geneateToken();
    //쿠키에 토큰 담기
    ctx.cookies.set('access_token', token, {
      //쿠키에 담기는 기간
      //1초  1분  1시간  1일
      maxAge: 1000 * 60 * 60 * 24 * 7,
      //스크립트로 조회를 막아서 XSS 방지
      httpOnly: true,
    });
  } catch (error) {
    ctx.throw(500, error);
  }
};
export const login = async (ctx) => {
  //로그인
  const { username, password } = ctx.request.body;
  //username 이나 password 를 입력하지 않을시
  if (!username || !password) {
    ctx.status = 401;
    ctx.body = '접근할 수 없습니다.';
    return;
  }
  try {
    //username 으로 회원 존재여부 판별
    const user = await User.findByUsername(username);
    if (!user) {
      ctx.status = 400;
      ctx.body = '존재하지 않는 회원입니다.';
      return;
    }
    //존재하는 회원이 입증되었으니 password 비교하기
    const checkPassword = await user.checkPassword(password);
    //라이브러리를 이용하여 해싱된 password 와 평문 password 를 비교한 결과가 동일한지
    if (checkPassword) {
      ctx.body = user.serialize();
      //토큰 생성
      const token = user.geneateToken();
      //쿠키에 토큰 담기
      ctx.cookies.set('access_token', token, {
        //쿠키에 담기는 기간
        //1초  1분  1시간  1일
        maxAge: 1000 * 60 * 60 * 24 * 7,
        //스크립트로 조회를 막아서 XSS 방지
        httpOnly: true,
      });
    } else {
      ctx.status = 400;
      ctx.body = '잘못된 비밀번호입니다.';
    }
  } catch (error) {
    ctx.throw(500, error);
  }
};
export const check = async (ctx) => {
  //로그인 상태 확인
};
export const logout = async (ctx) => {
  //로그아웃
};
