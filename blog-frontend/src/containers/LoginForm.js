import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from '../../node_modules/react-router-dom/dist/index';
import AuthForm from '../components/auth/AuthForm';
import { changeField, initializeForm, login } from '../modules/auth';
import { check } from '../modules/user';

const LoginForm = () => {
  const dispatch = useDispatch();
  const { auth, authError, form, user } = useSelector(({ auth, user }) => ({
    form: auth.login,
    auth: auth.auth,
    authError: auth.authError,
    user: user.user,
  }));

  const [error, setError] = useState('');

  const navigate = useNavigate();

  //인풋 변경 이벤트
  const onChange = (e) => {
    const { value, name } = e.target;
    dispatch(
      changeField({
        form: 'login',
        key: name,
        value,
      }),
    );
  };

  const onSubmit = (e) => {
    e.preventDefault();
    const { username, password } = form;
    dispatch(login({ username, password }));
  };

  //form 을 초기화, 이작업이 없을시 페이지 이동후에 돌아와도 input 값이 남게됨.
  //내부적으로 dispatch 를 사용하기에 두번째 파라미터로 dispatch 를 넣어준다.
  useEffect(() => {
    dispatch(initializeForm('login'));
  }, [dispatch]);

  useEffect(() => {
    if (authError) {
      setError('로그인 실패');
      return;
    }
    if (auth) {
      dispatch(check());
    }
  }, [auth, authError, dispatch]);

  useEffect(() => {
    if (user) {
      navigate('/');
      localStorage.setItem('user', user);
    }
  }, [navigate, user]);

  return (
    <AuthForm
      type="login"
      form={form}
      onChange={onChange}
      onSubmit={onSubmit}
      error={error}
    />
  );
};

export default LoginForm;
