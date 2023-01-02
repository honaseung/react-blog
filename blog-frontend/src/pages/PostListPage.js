import { useState } from 'react';
import Button from '../components/common/Button';
import PostPage from './PostPage';

const PostListPage = () => {
  const [postList, setPostList] = useState([]);

  return (
    <div>
      {postList.length > 0
        ? postList.map((post) => (
            <PostPage key={post.id}>{post}.title</PostPage>
          ))
        : '포스트 목록 페이지 입니다.'}
      <Button></Button>
    </div>
  );
};

export default PostListPage;
