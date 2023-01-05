import '../../style/components/auth/auth-template.scss';
import { Link } from 'react-router-dom';

const AuthTemplate = ({ children }) => {
  return (
    <div className="auth-template-block">
      <div className="white-box">
        <div className="logo-area">
          <Link to="/">REACTERS</Link>
        </div>
        {children}
      </div>
    </div>
  );
};

export default AuthTemplate;
