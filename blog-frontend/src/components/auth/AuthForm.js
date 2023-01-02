import { Link } from 'react-router-dom';
import '../../style/components/auth/auth-form.scss';
import Button from '../common/Button';

const textMap = {
  login: '로그인',
  register: '회원가입',
};

const AuthForm = ({ type, form, onChange, onSubmit }) => {
  const text = textMap[type];
  return (
    <div className="auth-form-block">
      <h3>{text}</h3>
      <form onSubmit={onSubmit}>
        {/**autoComplete 프로퍼티는 자동완성 설정이다. */}
        {/**프로퍼티에 name 을 주면 e.target.name 을 통해서 해당 인풋이 무엇을 가리키는지 알기 쉽다. */}
        <input
          autoComplete="username"
          name="username"
          placeholder="아이디"
          onChange={onChange}
          value={form.username}
        />
        {/**프로퍼티에 type 으로 password 를 주어서 입력시 '***...' 으로 보이도록 하였다. */}
        <input
          autoComplete="new-password"
          name="password"
          placeholder="비밀번호"
          type="password"
          onChange={onChange}
          value={form.password}
        />
        {type === 'register' && (
          <input
            autoComplete="new-password"
            name="passwordConfirm"
            placeholder="비밀번호 확인"
            type="password"
            onChange={onChange}
            value={form.passwordConfirm}
          />
        )}
        <Button fullWidth={true} cyan={true}>
          로그인
        </Button>
      </form>
      <div className="footer">
        {type === 'register' ? (
          <Link to={`/${textMap.login}`}>{textMap.login}</Link>
        ) : (
          <Link to={`/${textMap.register}`}>{textMap.register}</Link>
        )}
      </div>
    </div>
  );
};

export default AuthForm;
