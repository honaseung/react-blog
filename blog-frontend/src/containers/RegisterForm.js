import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from '../../node_modules/react-router-dom/dist/index';
import AuthForm from '../components/auth/AuthForm';
import { changeField, initializeForm, register } from '../modules/auth';
import { check } from '../modules/user';

const RegisterForm = () => {
  const dispatch = useDispatch();
  const { form, auth, authError, user } = useSelector(({ auth, user }) => ({
    form: auth.register,
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
        form: 'register',
        key: name,
        value,
      }),
    );
  };

  const onSubmit = (e) => {
    e.preventDefault();
    const { username, password, passwordConfirm } = form;
    if ([username, password, passwordConfirm].includes('')) {
      setError('모든 항목을 입력해 주십시오.');
      return;
    }
    if (password !== passwordConfirm) {
      setError('비밀번호는 일치해야 합니다.');
      dispatch(changeField({ form: 'register', key: 'password', value: '' }));
      dispatch(
        changeField({ form: 'register', key: 'passwordConfirm', value: '' }),
      );
      return;
    }
    dispatch(register({ username, password }));
  };

  //form 을 초기화, 이작업이 없을시 페이지 이동후에 돌아와도 input 값이 남게됨.
  //내부적으로 dispatch 를 사용하기에 두번째 파라미터로 dispatch 를 넣어준다.
  useEffect(() => {
    dispatch(initializeForm('register'));
  }, [dispatch]);

  useEffect(() => {
    if (authError) {
      if (authError.response.statue === 409) {
        setError('계정명이 중복 되었습니다.');
        return;
      }
      setError('회원 가입에 실패하였습니다.');
      return;
    }
    if (auth) {
      dispatch(check());
    }
  }, [auth, authError, dispatch]);

  useEffect(() => {
    if (user) {
      navigate('/');
      localStorage.setItem('user', JSON.stringify(user));
    }
  }, [navigate, user]);

  return (
    <AuthForm
      type="register"
      form={form}
      onChange={onChange}
      onSubmit={onSubmit}
      error={error}
    />
  );
};

export default RegisterForm;
