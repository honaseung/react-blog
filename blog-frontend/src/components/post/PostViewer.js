import '../../style/components/post/post-viewer.scss';
import SubInfo from '../common/SubInfo';
import Tags from '../common/Tags';

const PostViewer = ({ post, loading, error, actionButtons }) => {
  if (error) {
    if (error.response && error.response.status === 404) {
      return (
        <div className="post-viewer-block">포스트가 존재 하지 않습니다.</div>
      );
    }
    return <div className="post-viewer-block">오류가 발생하였습니다.</div>;
  }

  if (loading || !post) {
    return null;
  }

  const { title, body, user, publishedDate, tags } = post;

  return (
    <div className="post-viewer-block">
      <div className="post-head">
        <h1>{title}</h1>
        <SubInfo
          username={user.username}
          publishedDate={publishedDate}
          hasMarginTop
        />
        <Tags tags={tags} />
      </div>
      {actionButtons}
      <div
        className="post-content"
        dangerouslySetInnerHTML={{ __html: body }}
      />
    </div>
  );
};

export default PostViewer;
