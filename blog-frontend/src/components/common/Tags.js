import { Link } from 'react-router-dom';
import '../../style/components/common/tags.scss';

const Tags = ({ tags }) => {
  return (
    <div className="tags">
      {tags.map((tag) => (
        <Link className="tag" to={`/?tag=${tag}`} key={tag}>
          #{tag}
        </Link>
      ))}
    </div>
  );
};

export default Tags;
