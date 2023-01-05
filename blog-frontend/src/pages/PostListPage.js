import { Helmet } from 'react-helmet-async';
import HeaderContainer from '../containers/common/HeaderContainer';
import PaginationContainer from '../containers/common/PaginationContainer';
import PostListContainer from '../containers/post/PostListContainer';

const PostListPage = () => {
  return (
    <>
      <Helmet>
        <title>포스트 목록 조회</title>
      </Helmet>
      <HeaderContainer />
      <PostListContainer />
      <PaginationContainer />
    </>
  );
};

export default PostListPage;
