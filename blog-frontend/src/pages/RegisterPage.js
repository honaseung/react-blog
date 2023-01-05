import { Helmet } from 'react-helmet-async';
import AuthTemplate from '../components/auth/AuthTemplate';
import RegisterForm from '../containers/RegisterForm';

const RegisterPage = () => {
  return (
    <AuthTemplate>
      <Helmet>
        <title>회원가입</title>
      </Helmet>
      <RegisterForm type="register" />
    </AuthTemplate>
  );
};

export default RegisterPage;
