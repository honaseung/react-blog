import { Link } from 'react-router-dom';
import '../../style/components/common/responsive.scss';
import '../../style/components/post/post-list.scss';
import Button from '../common/Button';
import SubInfo from '../common/SubInfo';
import Tags from '../common/Tags';

const PostItem = ({ post }) => {
  const { publishedDate, user, tags, title, body, _id } = post;
  return (
    <div className="post-item-block">
      <h2>
        <Link to={`/${user.username}/${_id}`}>{title}</Link>
      </h2>
      <SubInfo username={user.username} publishedDate={publishedDate} />
      <Tags tags={tags} />
      <p>{body}</p>
    </div>
  );
};

const PostList = ({ posts, loading, error, showWriteButton }) => {
  if (error) {
    return <div className="post-list-block">오류가 발생하였습니다.</div>;
  }

  return (
    <div className="post-list-block">
      <div className="write-post-button-wrapper">
        {showWriteButton && (
          <Button cyan to="/write">
            글 작성하기
          </Button>
        )}
      </div>
      {!loading && posts && (
        <div>
          {posts.map((post) => (
            <PostItem post={post} key={post._id} />
          ))}
        </div>
      )}
    </div>
  );
};

export default PostList;
