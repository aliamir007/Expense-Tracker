import { createContext, useContext, useState } from 'react';
import { registerUser, loginUser } from '../api/authApi';
import { TOKEN_KEY } from '../api/axiosInstance';

const EMAIL_KEY = 'expenseTracker_email';
const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [token, setToken] = useState(() => localStorage.getItem(TOKEN_KEY));
  const [email, setEmail] = useState(() => localStorage.getItem(EMAIL_KEY) || '');
  const [loading, setLoading] = useState(false);

  const isAuthenticated = !!token;

  async function register({ name, email, password }) {
    setLoading(true);
    try {
      return await registerUser({ name, email, password });
    } finally {
      setLoading(false);
    }
  }

  async function login({ email, password }) {
    setLoading(true);
    try {
      const data = await loginUser({ email, password });
      if (data.token) {
        localStorage.setItem(TOKEN_KEY, data.token);
        localStorage.setItem(EMAIL_KEY, email);
        setToken(data.token);
        setEmail(email);
      }
      return data;
    } finally {
      setLoading(false);
    }
  }

  function logout() {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(EMAIL_KEY);
    setToken(null);
    setEmail('');
  }

  const value = { token, email, isAuthenticated, loading, register, login, logout };
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within an AuthProvider');
  return ctx;
}
