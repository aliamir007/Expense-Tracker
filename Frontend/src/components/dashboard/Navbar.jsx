import { useExpense } from '../../context/ExpenseContext';
import { useAuth } from '../../context/AuthContext';
import { formatDate } from '../../utils/format';

export default function Navbar() {
  const { transactions, resetBudget } = useExpense();
  const { logout } = useAuth();

  function handleReset() {
    if (transactions.length > 0 && !window.confirm('Reset everything and start fresh?')) return;
    resetBudget();
  }

  function handleLogout() {
    if (!window.confirm('Log out?')) return;
    logout();
  }

  return (
    <nav className="navbar">
      <div className="nav-logo">
        <div className="logo-mark small">💰</div>
        <span>BudgetFlow</span>
      </div>
      <div className="nav-right">
        <span className="nav-date">{formatDate(new Date())}</span>
        <button className="btn-reset" onClick={handleReset}>
          ↩ Reset
        </button>
        <button className="btn-reset" onClick={handleLogout}>
          ⏻ Logout
        </button>
      </div>
    </nav>
  );
}
