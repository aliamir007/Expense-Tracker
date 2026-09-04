import { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { useToast } from './ToastContext';
import { formatCurrency, CURRENCIES } from '../utils/format';
import { getErrorMessage } from '../api/axiosInstance';
import { fetchBudget, saveBudget } from '../api/budgetApi';
import {
  fetchTransactions,
  createTransaction as createTransactionApi,
  updateTransaction as updateTransactionApi,
  deleteTransaction as deleteTransactionApi,
} from '../api/transactionApi';

const ExpenseContext = createContext(null);

function mapTransaction(t) {
  const quantity = t.quantity || 1;
  return {
    id: t._id,
    type: t.type,
    title: t.title,
    category: t.category,
    priority: t.priority || 'medium',
    qty: quantity,
    amount: (t.amount || 0) / quantity, // per-unit price, derived
    total: t.amount || 0,
    date: t.date,
  };
}

export function ExpenseProvider({ children }) {
  const { showToast } = useToast();

  const [budget, setBudget] = useState(0);
  const [currencyCode, setCurrencyCode] = useState('PKR');
  const [currencySymbol, setCurrencySymbol] = useState('Rs');
  const [transactions, setTransactions] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [loading, setLoading] = useState(true);

  // Load the user's budget + transactions from the backend once on mount.
  useEffect(() => {
    let cancelled = false;

    async function load() {
      setLoading(true);
      try {
        const [budgetRes, txRes] = await Promise.all([fetchBudget(), fetchTransactions()]);
        if (cancelled) return;

        if (budgetRes.success) {
          const curr = budgetRes.data.currency || 'PKR';
          setBudget(budgetRes.data.budget || 0);
          setCurrencyCode(curr);
          setCurrencySymbol(CURRENCIES.find((c) => c.code === curr)?.symbol || 'Rs');
        }
        if (txRes.success) {
          setTransactions(txRes.data.map(mapTransaction));
        }
      } catch (err) {
        showToast(getErrorMessage(err), 'error');
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    load();
    return () => { cancelled = true; };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const isSetup = budget > 0;

  const fmt = (n) => formatCurrency(n, currencySymbol);

  const totalExpense = useMemo(
    () => transactions.filter((t) => t.type === 'expense').reduce((s, t) => s + t.total, 0),
    [transactions]
  );
  const totalIncome = useMemo(
    () => transactions.filter((t) => t.type === 'income').reduce((s, t) => s + t.total, 0),
    [transactions]
  );
  const remaining = budget - totalExpense;
  const usedPct = budget > 0 ? Math.min((totalExpense / budget) * 100, 100) : 0;

  async function setupBudget({ amount, currency, symbol }) {
    try {
      const res = await saveBudget(amount, currency);
      if (res.success) {
        setBudget(res.data.budget);
        setCurrencyCode(res.data.currency);
        setCurrencySymbol(symbol);
        showToast(`Budget set to ${formatCurrency(res.data.budget, symbol)}. Start adding transactions!`, 'success');
      } else {
        showToast(res.message || 'Could not save budget.', 'error');
      }
    } catch (err) {
      showToast(getErrorMessage(err), 'error');
    }
  }

  async function resetBudget() {
    try {
      await Promise.all(transactions.map((t) => deleteTransactionApi(t.id)));
      const res = await saveBudget(0, currencyCode);
      setTransactions([]);
      setEditingId(null);
      if (res.success) setBudget(0);
    } catch (err) {
      showToast(getErrorMessage(err), 'error');
    }
  }

  async function addTransaction({ type, title, category, priority, amount, qty }) {
    const quantity = type === 'expense' ? (qty || 1) : 1;
    const total = amount * quantity;

    if (editingId !== null) {
      const old = transactions.find((t) => t.id === editingId);
      const expenseWithoutOld = totalExpense - (old && old.type === 'expense' ? old.total : 0);
      const newExpense = expenseWithoutOld + (type === 'expense' ? total : 0);
    
      if (budget - newExpense < 0) {
        showToast(`This would exceed your remaining budget of ${fmt(budget - expenseWithoutOld)}.`, 'error');
        return false;
      }

      try {
        const res = await updateTransactionApi(editingId, {
          title, type, category,
          priority: type === 'expense' ? priority : undefined,
          amount: total,
          quantity,
        });
        if (res.success) {
          setTransactions((prev) => prev.map((t) => (t.id === editingId ? mapTransaction(res.data) : t)));
          showToast(`"${title}" updated successfully.`, 'success');
          setEditingId(null);
          return true;
        }
        showToast(res.message || 'Update failed.', 'error');
        return false;
      } catch (err) {
        showToast(getErrorMessage(err), 'error');
        return false;
      }
    }

    if (type === 'expense' && totalExpense + total > budget) {
      showToast(`This exceeds your remaining budget of ${fmt(remaining)}.`, 'error');
      return false;
    }

    try {
      const res = await createTransactionApi({
        title, type, category,
        priority: type === 'expense' ? priority : undefined,
        amount: total,
        quantity,
        date: new Date().toISOString(),
      });
      if (res.success) {
        setTransactions((prev) => [...prev, mapTransaction(res.data)]);
        showToast(`"${title}" added — ${type === 'income' ? '+' : '-'}${fmt(total)}.`, 'success');
        return true;
      }
      showToast(res.message || 'Could not add transaction.', 'error');
      return false;
    } catch (err) {
      showToast(getErrorMessage(err), 'error');
      return false;
    }
  }

  function startEdit(id) {
    setEditingId(id);
    return transactions.find((t) => t.id === id) || null;
  }

  function cancelEdit() {
    setEditingId(null);
  }

  async function deleteTransaction(id) {
    const item = transactions.find((t) => t.id === id);
    try {
      const res = await deleteTransactionApi(id);
      if (res.success) {
        setTransactions((prev) => prev.filter((t) => t.id !== id));
        if (item) showToast(`"${item.title}" removed.`, 'warning');
        if (editingId === id) setEditingId(null);
      } else {
        showToast(res.message || 'Could not delete transaction.', 'error');
      }
    } catch (err) {
      showToast(getErrorMessage(err), 'error');
    }
  }

  const value = {
    budget,
    currencyCode,
    currencySymbol,
    transactions,
    editingId,
    isSetup,
    loading,
    totalExpense,
    totalIncome,
    remaining,
    usedPct,
    fmt,
    setupBudget,
    resetBudget,
    addTransaction,
    startEdit,
    cancelEdit,
    deleteTransaction,
  };

  return <ExpenseContext.Provider value={value}>{children}</ExpenseContext.Provider>;
}

export function useExpense() {
  const ctx = useContext(ExpenseContext);
  if (!ctx) throw new Error('useExpense must be used within an ExpenseProvider');
  return ctx;
}
