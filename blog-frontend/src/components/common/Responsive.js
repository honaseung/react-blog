import '../../style/components/common/responsive.scss';

const Responsive = ({ children, ...rest }) => {
  return (
    <div className="responsive-block" {...rest}>
      children
    </div>
  );
};

export default Responsive;
