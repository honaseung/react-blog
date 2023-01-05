import client from './client';

export const listPosts = ({ page, username, tag }) => {
  return client.get(`/api/post`, {
    params: { page, username, tag },
  });
};
