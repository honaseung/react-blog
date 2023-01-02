import AuthTemplate from '../components/auth/AuthTemplate';
import RegisterForm from '../containers/RegisterForm';

const RegisterPage = () => {
  return (
    <AuthTemplate>
      <RegisterForm type="register" />
    </AuthTemplate>
  );
};

export default RegisterPage;
