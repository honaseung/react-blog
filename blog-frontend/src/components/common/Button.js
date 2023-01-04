import { Link } from 'react-router-dom';
import '../../style/components/common/button.scss';

const Button = ({ to, history, ...rest }) => {
  let style = 'btn-cmm';
  style = `${style} ${rest.fullWidth ? 'fullWidth' : ''} ${
    rest.cyan ? 'cyan' : ''
  }`;
  return (
    <div>
      {to ? (
        <Link className={style} to={to}>
          {rest.children}
        </Link>
      ) : (
        <button className={style} type="submit" onClick={rest.onClick}>
          {rest.children}
        </button>
      )}
    </div>
  );
};

export default Button;
