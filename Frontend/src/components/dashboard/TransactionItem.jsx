import { useExpense } from '../../context/ExpenseContext';
import { getCategoryMeta, PRIORITIES } from '../../utils/categories';

export default function TransactionItem({ item }) {
  const { fmt, startEdit, deleteTransaction } = useExpense();
  const meta = getCategoryMeta(item.type, item.category);
  const priorityMeta = item.type === 'expense' ? PRIORITIES[item.priority] || PRIORITIES.medium : null;

  return (
    <div className="item-row" id={`row-${item.id}`}>
      <div className="item-emoji">{meta.emoji}</div>
      <div className="item-info">
        <div className="item-name">{item.title}</div>
        <div className="item-tags">
          <span className="tag tag-cat">{meta.label}</span>
          {priorityMeta && <span className={`tag ${priorityMeta.className}`}>{priorityMeta.label}</span>}
          {item.type === 'expense' && item.qty > 1 && <span className="tag-qty">× {item.qty}</span>}
        </div>
      </div>
      <div className={`item-amount ${item.type}`}>
        {item.type === 'income' ? '+' : '-'} {fmt(item.total)}
      </div>
      <div className="item-actions">
        <button className="icon-btn edit-btn" title="Edit" onClick={() => startEdit(item.id)}>✏️</button>
        <button className="icon-btn del-btn" title="Delete" onClick={() => deleteTransaction(item.id)}>🗑️</button>
      </div>
    </div>
  );
}
