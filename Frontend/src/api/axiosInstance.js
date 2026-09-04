import axios from 'axios';

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api';

const TOKEN_KEY = 'expenseTracker_token';
const EMAIL_KEY = 'expenseTracker_email';

const axiosInstance = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Attach JWT to requests
axiosInstance.interceptors.request.use((config) => {
  const token = localStorage.getItem(TOKEN_KEY);

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

// Automatically clear invalid/expired token
axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem(TOKEN_KEY);
      localStorage.removeItem(EMAIL_KEY);

      // Reload so AuthContext starts with no token
      window.location.reload();
    }

    return Promise.reject(error);
  }
);

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