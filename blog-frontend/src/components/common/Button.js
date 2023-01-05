import { Link } from 'react-router-dom';
import '../../style/components/common/button.scss';

const Button = ({ disabled, to, history, ...rest }) => {
  let style = 'btn-cmm';
  style = `${style}${rest.fullWidth ? ' fullWidth' : ''}${
    rest.cyan ? ' cyan' : ''
  }${rest.modal ? ' modal' : ''}`;
  return (
    <>
      {to ? (
        <Link className={style} to={to} disabled={disabled}>
          {rest.children}
        </Link>
      ) : (
        <button
          className={style}
          type="submit"
          onClick={rest.onClick}
          disabled={disabled}
        >
          {rest.children}
        </button>
      )}
    </>
  );
};

export default Button;
