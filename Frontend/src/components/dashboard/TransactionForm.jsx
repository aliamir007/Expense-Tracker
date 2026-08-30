import { useEffect, useState } from 'react';
import { useExpense } from '../../context/ExpenseContext';
import { useToast } from '../../context/ToastContext';
import { getCategories } from '../../utils/categories';

const EMPTY_FORM = { type: 'expense', title: '', category: 'food', priority: 'medium', amount: '', qty: '1' };

export default function TransactionForm() {
  const { editingId, transactions, addTransaction, cancelEdit } = useExpense();
  const { showToast } = useToast();
  const [form, setForm] = useState(EMPTY_FORM);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (editingId === null) return;
    const item = transactions.find((t) => t.id === editingId);
    if (!item) return;
    setForm({
      type: item.type,
      title: item.title,
      category: item.category,
      priority: item.priority || 'medium',
      amount: String(item.amount),
      qty: String(item.qty),
    });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [editingId]); // eslint-disable-line react-hooks/exhaustive-deps

  function updateField(field, value) {
    setForm((prev) => {
      const next = { ...prev, [field]: value };
      // Reset category to first valid option when switching type
      if (field === 'type') {
        const cats = getCategories(value);
        next.category = Object.keys(cats)[0];
      }
      return next;
    });
  }

  async function handleSubmit() {
    const title = form.title.trim();
    const amount = parseFloat(form.amount);
    const qty = parseInt(form.qty) || 1;

    if (!title) {
      showToast('Please enter a title.', 'warning');
      return;
    }
    if (!amount || amount <= 0) {
      showToast('Please enter a valid amount.', 'warning');
      return;
    }

    setSubmitting(true);
    try {
      const ok = await addTransaction({
        type: form.type,
        title,
        category: form.category,
        priority: form.priority,
        amount,
        qty: form.type === 'expense' ? qty : 1,
      });

      if (ok && editingId === null) {
        setForm({ ...EMPTY_FORM, type: form.type, category: Object.keys(getCategories(form.type))[0] });
      }
    } finally {
      setSubmitting(false);
    }
  }

  function handleCancel() {
    cancelEdit();
    setForm(EMPTY_FORM);
    showToast('Edit cancelled.', 'warning');
  }

  const categories = getCategories(form.type);
  const isEditing = editingId !== null;

  return (
    <div className="card form-card">
      <div className="card-head">
        <h2 className="card-title">➕ Add Transaction</h2>
      </div>
      <div className="card-body">

        <div className="type-tabs">
          <button
            type="button"
            className={`type-tab expense${form.type === 'expense' ? ' active' : ''}`}
            onClick={() => updateField('type', 'expense')}
          >
            💳 Expense
          </button>
          <button
            type="button"
            className={`type-tab income${form.type === 'income' ? ' active' : ''}`}
            onClick={() => updateField('type', 'income')}
          >
            💵 Income
          </button>
        </div>

        <div className="form-grid">
          <div className="fg-full">
            <label className="field-label">{form.type === 'income' ? 'Source' : 'Item Name'}</label>
            <input
              className="field-input"
              type="text"
              placeholder={form.type === 'income' ? 'e.g. Salary, Freelance project…' : 'e.g. Groceries, Electricity bill…'}
              value={form.title}
              onChange={(e) => updateField('title', e.target.value)}
            />
          </div>
          <div>
            <label className="field-label">Category</label>
            <select className="field-input" value={form.category} onChange={(e) => updateField('category', e.target.value)}>
              {Object.entries(categories).map(([key, meta]) => (
                <option key={key} value={key}>
                  {meta.emoji} {meta.label}
                </option>
              ))}
            </select>
          </div>

          {form.type === 'expense' && (
            <div>
              <label className="field-label">Priority</label>
              <select className="field-input" value={form.priority} onChange={(e) => updateField('priority', e.target.value)}>
                <option value="high">🔴 High</option>
                <option value="medium">🟡 Medium</option>
                <option value="low">🟢 Low</option>
              </select>
            </div>
          )}

          <div>
            <label className="field-label">Amount</label>
            <input
              className="field-input"
              type="number"
              placeholder="0"
              min="0"
              value={form.amount}
              onChange={(e) => updateField('amount', e.target.value)}
            />
          </div>

          {form.type === 'expense' && (
            <div>
              <label className="field-label">Quantity</label>
              <input
                className="field-input"
                type="number"
                min="1"
                max="999"
                value={form.qty}
                onChange={(e) => updateField('qty', e.target.value)}
              />
            </div>
          )}
        </div>

        <button className={`btn-add${isEditing ? ' editing' : ''}`} onClick={handleSubmit} disabled={submitting}>
          {submitting
            ? 'Saving…'
            : isEditing
              ? '💾 Save Changes'
              : `➕ Add ${form.type === 'income' ? 'Income' : 'Expense'}`}
        </button>
        {isEditing && (
          <button className="btn-cancel-edit" onClick={handleCancel}>
            ✕ Cancel Edit
          </button>
        )}
      </div>
    </div>
  );
}
