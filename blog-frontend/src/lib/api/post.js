import client from './client';

export const writePost = ({ title, body, tags }) =>
  client.post('/api/post', { title, body, tags });

export const readPost = (id) => client.get(`/api/post/${id}`);

export const updatePost = ({ id, title, body, tags }) =>
  client.patch(`/api/post/${id}`, { title, body, tags });

export const removePost = (id) => client.delete(`/api/post/${id}`);
