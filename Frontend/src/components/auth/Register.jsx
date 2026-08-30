import { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import { getErrorMessage } from '../../api/axiosInstance';

export default function Register({ onSwitch, onRegistered }) {
  const { register, loading } = useAuth();
  const { showToast } = useToast();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');

  async function handleSubmit() {
    if (!name.trim() || !email.trim() || !password) {
      showToast('Please fill in all fields.', 'warning');
      return;
    }
    if (password.length < 6) {
      showToast('Password should be at least 6 characters.', 'warning');
      return;
    }
    if (password !== confirm) {
      showToast('Passwords do not match.', 'warning');
      return;
    }
    try {
      const data = await register({ name: name.trim(), email: email.trim(), password });
      if (data.success) {
        showToast('Account created! Please log in.', 'success');
        onRegistered(email.trim());
      } else {
        showToast(data.message || 'Registration failed.', 'error');
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

        <h1 className="setup-title">Create Account</h1>
        <p className="setup-sub">Sign up to start tracking your budget.</p>

        <div className="setup-fields">
          <label className="field-label">Name</label>
          <input
            className="field-input"
            type="text"
            placeholder="Your name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            onKeyDown={handleKeyDown}
          />

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
            placeholder="At least 6 characters"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            onKeyDown={handleKeyDown}
          />

          <label className="field-label">Confirm Password</label>
          <input
            className="field-input"
            type="password"
            placeholder="Re-enter password"
            value={confirm}
            onChange={(e) => setConfirm(e.target.value)}
            onKeyDown={handleKeyDown}
          />

          <button className="btn-start" onClick={handleSubmit} disabled={loading}>
            {loading ? 'Creating account…' : 'Sign Up →'}
          </button>

          <p className="auth-switch">
            Already have an account?{' '}
            <button type="button" className="link-btn" onClick={onSwitch}>
              Log in
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}
