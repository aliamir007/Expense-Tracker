import { useMemo } from 'react';
import { useExpense } from '../../context/ExpenseContext';
import { getCategoryMeta } from '../../utils/categories';

export default function Breakdown() {
  const { transactions, totalExpense, fmt } = useExpense();

  const rows = useMemo(() => {
    const totals = {};
    transactions
      .filter((t) => t.type === 'expense')
      .forEach((t) => { totals[t.category] = (totals[t.category] || 0) + t.total; });
    return Object.entries(totals).sort((a, b) => b[1] - a[1]);
  }, [transactions]);

  return (
    <div className="card">
      <div className="card-head">
        <h2 className="card-title">📊 Spending Breakdown</h2>
      </div>
      <div className="card-body">
        {rows.length === 0 ? (
          <p className="empty-text">Add expenses to see a breakdown by category.</p>
        ) : (
          rows.map(([cat, total]) => {
            const meta = getCategoryMeta('expense', cat);
            const pct = totalExpense > 0 ? (total / totalExpense) * 100 : 0;
            return (
              <div key={cat}>
                <div className="breakdown-row">
                  <div className="bd-dot" style={{ background: meta.color }}></div>
                  <div className="bd-label">{meta.label}</div>
                  <div className="bd-right">
                    <div className="bd-amt">{fmt(total)}</div>
                    <div className="bd-pct">{pct.toFixed(1)}%</div>
                  </div>
                </div>
                <div className="bd-bar-wrap">
                  <div className="bd-bar" style={{ width: `${pct}%`, background: meta.color }}></div>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
