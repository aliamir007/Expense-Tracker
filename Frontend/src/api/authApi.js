import axiosInstance from './axiosInstance';

export async function registerUser({ name, email, password }) {
  const res = await axiosInstance.post('/auth/register', { name, email, password });
  return res.data;
}

export async function loginUser({ email, password }) {
  const res = await axiosInstance.post('/auth/login', { email, password });
  return res.data;
}
