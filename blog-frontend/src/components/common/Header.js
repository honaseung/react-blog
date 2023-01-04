import { Link } from 'react-router-dom';
import '../../style/components/common/header.scss';
import Button from './Button';

const Header = ({ user, onLogout }) => {
  return (
    <>
      <div className="header-block">
        <div className="wrapper">
          <Link to="/" className="logo">
            REACTERS
          </Link>
          <div className="right">
            {user ? (
              <>
                <div className="user-info">{user.username}</div>
                <Button onClick={onLogout}>로그아웃</Button>
              </>
            ) : (
              <Button to="/login">로그인</Button>
            )}
          </div>
        </div>
      </div>
      <div className="spacer" />
    </>
  );
};

export default Header;
