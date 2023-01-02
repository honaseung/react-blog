import AuthTemplate from '../components/auth/AuthTemplate';
import LoginForm from '../containers/LoginForm';

const LoginPage = () => {
  return (
    <AuthTemplate>
      <LoginForm type="login" />
    </AuthTemplate>
  );
};

export default LoginPage;
