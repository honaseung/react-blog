import { Helmet } from 'react-helmet-async';
import AuthTemplate from '../components/auth/AuthTemplate';
import LoginForm from '../containers/LoginForm';

const LoginPage = () => {
  return (
    <AuthTemplate>
      <Helmet>
        <title>로그인</title>
      </Helmet>
      <LoginForm type="login" />
    </AuthTemplate>
  );
};

export default LoginPage;
