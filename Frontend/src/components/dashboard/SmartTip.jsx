import { useMemo, useRef } from 'react';
import { useExpense } from '../../context/ExpenseContext';
import { TIPS } from '../../utils/categories';

export default function SmartTip() {
  const { budget, totalExpense, transactions } = useExpense();
  const tipIdxRef = useRef(0);

  const tip = useMemo(() => {
    const pct = budget > 0 ? (totalExpense / budget) * 100 : 0;

    if (pct >= 95) return "🚨 You've nearly used your entire budget. Avoid any further non-essential spending.";
    if (pct >= 80) return "⚠️ You've used over 80% of your budget. Only spend on essential items from here.";
    if (pct >= 60) return "📊 You've crossed 60% of your budget. Great time to review your spending.";
    if (!transactions.length) return "Add your first transaction and we'll provide personalized budget tips here.";

    tipIdxRef.current = (tipIdxRef.current + 1) % TIPS.length;
    return TIPS[tipIdxRef.current];
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [transactions.length, totalExpense, budget]);

  return (
    <div className="card tip-card">
      <div className="card-head">
        <h2 className="card-title">💡 Smart Tip</h2>
      </div>
      <div className="card-body">
        <p className="tip-text">{tip}</p>
      </div>
    </div>
  );
}
