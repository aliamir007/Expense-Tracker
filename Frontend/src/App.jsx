import { ToastProvider } from './context/ToastContext';
import { AuthProvider, useAuth } from './context/AuthContext';
import { ExpenseProvider, useExpense } from './context/ExpenseContext';
import AuthGate from './components/auth/AuthGate';
import SetupScreen from './components/setup/SetupScreen';
import Dashboard from './components/dashboard/Dashboard';

function ExpenseGate() {
  const { isSetup, loading } = useExpense();

  if (loading) {
    return (
      <div className="screen active" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '100vh' }}>
        <p style={{ color: 'var(--text2)', fontSize: 15 }}>Loading your data…</p>
      </div>
    );
  }

  return isSetup ? <Dashboard /> : <SetupScreen />;
}

function AppShell() {
  const { isAuthenticated } = useAuth();
  if (!isAuthenticated) return <AuthGate />;
  return (
    <ExpenseProvider>
      <ExpenseGate />
    </ExpenseProvider>
  );
}

export default function App() {
  return (
    <ToastProvider>
      <AuthProvider>
        <AppShell />
      </AuthProvider>
    </ToastProvider>
  );
}
