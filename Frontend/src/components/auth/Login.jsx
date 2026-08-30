import { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import { getErrorMessage } from '../../api/axiosInstance';

export default function Login({ onSwitch, prefillEmail = '' }) {
  const { login, loading } = useAuth();
  const { showToast } = useToast();
  const [email, setEmail] = useState(prefillEmail);
  const [password, setPassword] = useState('');

  async function handleSubmit() {
    if (!email.trim() || !password) {
      showToast('Please enter your email and password.', 'warning');
      return;
    }
    try {
      const data = await login({ email: email.trim(), password });
      if (data.success) {
        showToast('Welcome back!', 'success');
      } else {
        showToast(data.message || 'Login failed.', 'error');
      }
    } catch (err) {
      showToast(getErrorMessage(err), 'error');
    }
  }

  function handleKeyDown(e) {
    if (e.key === 'Enter') handleSubmit();
  }

  return (
    <div id="screen-setup" className="screen active">
      <div className="setup-card">
        <div className="setup-logo">
          <div className="logo-mark">💰</div>
          <span>BudgetFlow</span>
        </div>

        <h1 className="setup-title">Welcome Back</h1>
        <p className="setup-sub">Log in to access your budget and transactions.</p>

        <div className="setup-fields">
          <label className="field-label">Email</label>
          <input
            className="field-input"
            type="email"
            placeholder="you@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            onKeyDown={handleKeyDown}
          />

          <label className="field-label">Password</label>
          <input
            className="field-input"
            type="password"
            placeholder="••••••••"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            onKeyDown={handleKeyDown}
          />

          <button className="btn-start" onClick={handleSubmit} disabled={loading}>
            {loading ? 'Logging in…' : 'Log In →'}
          </button>

          <p className="auth-switch">
            Don't have an account?{' '}
            <button type="button" className="link-btn" onClick={onSwitch}>
              Create one
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}
