import { Helmet } from 'react-helmet-async';
import HeaderContainer from '../containers/common/HeaderContainer';
import PostViewerContainer from '../containers/post/PostViewerContainer';

const PostPage = () => {
  return (
    <>
      <Helmet>
        <title>상세내용</title>
      </Helmet>
      <HeaderContainer />
      <PostViewerContainer />
    </>
  );
};

export default PostPage;
