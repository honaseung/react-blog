import '../../style/components/common/button.scss';

const Button = ({ children, fullWidth, cyan }) => {
  let style = 'btn-cmm';
  style = `${style} ${fullWidth ? 'fullWidth' : ''} ${cyan ? 'cyan' : ''}`;
  return (
    <div>
      <button className={style} type="submit">
        {children}
      </button>
    </div>
  );
};

export default Button;
