import { useState } from 'react';
import { useExpense } from '../../context/ExpenseContext';
import { useToast } from '../../context/ToastContext';
import { CURRENCIES } from '../../utils/format';

const QUICK_AMOUNTS = [
  { label: '10K', value: 10000 },
  { label: '25K', value: 25000 },
  { label: '50K', value: 50000 },
  { label: '1 Lac', value: 100000 },
  { label: '5 Lac', value: 500000 },
];

export default function SetupScreen() {
  const { setupBudget } = useExpense();
  const { showToast } = useToast();
  const [currency, setCurrency] = useState('PKR');
  const [amount, setAmount] = useState('');
  const [saving, setSaving] = useState(false);

  async function handleStart() {
    const val = parseFloat(amount);
    if (!val || val <= 0) {
      showToast('Please enter a valid budget amount.', 'warning');
      return;
    }
    const currencyMeta = CURRENCIES.find((c) => c.code === currency);
    setSaving(true);
    try {
      await setupBudget({ amount: val, currency, symbol: currencyMeta.symbol });
    } finally {
      setSaving(false);
    }
  }

  function handleKeyDown(e) {
    if (e.key === 'Enter') handleStart();
  }

  return (
    <div id="screen-setup" className="screen active">
      <div className="setup-card">
        <div className="setup-logo">
          <div className="logo-mark">💰</div>
          <span>BudgetFlow</span>
        </div>

        <h1 className="setup-title">Set Your Budget</h1>
        <p className="setup-sub">
          Choose your currency, enter your total budget, and start tracking expenses in real time.
        </p>

        <div className="setup-fields">
          <label className="field-label">Currency</label>
          <select
            className="field-input"
            value={currency}
            onChange={(e) => setCurrency(e.target.value)}
          >
            {CURRENCIES.map((c) => (
              <option key={c.code} value={c.code}>
                {c.flag} {c.code} — {c.label}
              </option>
            ))}
          </select>

          <label className="field-label">Total Budget</label>
          <input
            className="field-input"
            type="number"
            placeholder="e.g. 50000"
            min="1"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            onKeyDown={handleKeyDown}
          />

          <div className="quick-row">
            <span className="quick-label">Quick amounts:</span>
            <div className="quick-chips">
              {QUICK_AMOUNTS.map((q) => (
                <button key={q.label} className="chip" onClick={() => setAmount(String(q.value))}>
                  {q.label}
                </button>
              ))}
            </div>
          </div>

          <button className="btn-start" onClick={handleStart} disabled={saving}>
            {saving ? 'Saving…' : 'Start Tracking →'}
          </button>
        </div>
      </div>
    </div>
  );
}
