import { createContext, useCallback, useContext, useRef, useState } from 'react';

const ToastContext = createContext(null);

const ICONS = { success: '✅', warning: '⚠️', error: '❌' };

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([]);
  const idRef = useRef(0);

  const showToast = useCallback((message, type = 'success') => {
    const id = ++idRef.current;
    setToasts((prev) => [...prev, { id, message, type, leaving: false }]);

    setTimeout(() => {
      setToasts((prev) => prev.map((t) => (t.id === id ? { ...t, leaving: true } : t)));
      setTimeout(() => {
        setToasts((prev) => prev.filter((t) => t.id !== id));
      }, 320);
    }, 3500);
  }, []);

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      <div id="toast-area">
        {toasts.map((t) => (
          <div key={t.id} className={`toast t-${t.type}${t.leaving ? ' t-out' : ''}`}>
            <span className="toast-icon">{ICONS[t.type] || 'ℹ️'}</span>
            <span>{t.message}</span>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
}

export function useToast() {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error('useToast must be used within a ToastProvider');
  return ctx;
}
