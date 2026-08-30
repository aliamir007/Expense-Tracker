import { useExpense } from '../../context/ExpenseContext';

export default function SummaryCards() {
  const { budget, totalIncome, totalExpense, remaining, transactions, fmt, usedPct } = useExpense();

  const remainingColor = usedPct >= 90 ? 'var(--red)' : usedPct >= 70 ? 'var(--amber)' : 'var(--green)';

  return (
    <section className="summary-row cols-5">
      <div className="summary-card card-budget">
        <div className="sc-icon">🏦</div>
        <div className="sc-body">
          <div className="sc-label">Total Budget</div>
          <div className="sc-value">{fmt(budget)}</div>
        </div>
      </div>
      <div className="summary-card card-income">
        <div className="sc-icon">💵</div>
        <div className="sc-body">
          <div className="sc-label">Total Income</div>
          <div className="sc-value">{fmt(totalIncome)}</div>
        </div>
      </div>
      <div className="summary-card card-spent">
        <div className="sc-icon">💳</div>
        <div className="sc-body">
          <div className="sc-label">Total Spent</div>
          <div className="sc-value">{fmt(totalExpense)}</div>
        </div>
      </div>
      <div className="summary-card card-remaining">
        <div className="sc-icon">✅</div>
        <div className="sc-body">
          <div className="sc-label">Remaining</div>
          <div className="sc-value" style={{ color: remainingColor }}>{fmt(remaining)}</div>
        </div>
      </div>
      <div className="summary-card card-items">
        <div className="sc-icon">📦</div>
        <div className="sc-body">
          <div className="sc-label">No. of Items</div>
          <div className="sc-value">{transactions.length}</div>
        </div>
      </div>
    </section>
  );
}
