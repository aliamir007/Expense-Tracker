import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api';
const TOKEN_KEY = 'expenseTracker_token';

const axiosInstance = axios.create({
  baseURL: API_BASE_URL,
  headers: { 'Content-Type': 'application/json' },
});

axiosInstance.interceptors.request.use((config) => {
  const token = localStorage.getItem(TOKEN_KEY);
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

export function getErrorMessage(err) {
  return (
    err?.response?.data?.message ||
    (err?.message === 'Network Error'
      ? 'Cannot reach the server. Is the backend running?'
      : err?.message) ||
    'Something went wrong.'
  );
}

export { TOKEN_KEY };
export default axiosInstance;
