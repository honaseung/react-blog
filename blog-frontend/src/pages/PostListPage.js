import { useState } from 'react';
import PostPage from './PostPage';

const PostListPage = () => {
  const [postList, setPostList] = useState([]);

  return (
    <div>
      {postList.map((post) => (
        <PostPage key={post.id}>{post}.title</PostPage>
      ))}
    </div>
  );
};

export default PostListPage;
