import { Link } from 'react-router-dom';
import '../../style/components/common/sub-info.scss';

const SubInfo = ({ username, publishedDate, hasMarginTop }) => {
  return (
    <div className={`sub-info${hasMarginTop ? ' mt-1r' : ''}`}>
      <span>
        <b>
          <Link to={`/${username}`}>{username}</Link>
        </b>
      </span>
      <span>{new Date().toLocaleDateString()}</span>
    </div>
  );
};

export default SubInfo;
