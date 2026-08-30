import { useExpense } from '../../context/ExpenseContext';

export default function ProgressBar() {
  const { budget, usedPct, fmt } = useExpense();

  const barClass = 'progress-bar' + (usedPct >= 90 ? ' danger' : usedPct >= 70 ? ' warn' : '');

  return (
    <section className="progress-section">
      <div className="progress-top">
        <span className="progress-title">Budget Used</span>
        <span className="progress-pct">{usedPct.toFixed(1)}%</span>
      </div>
      <div className="progress-track">
        <div className={barClass} style={{ width: `${usedPct}%` }}></div>
      </div>
      <div className="progress-labels">
        <span>{fmt(0)}</span>
        <span>{fmt(budget)}</span>
      </div>
    </section>
  );
}
