import { useMemo, useState } from 'react';
import { useExpense } from '../../context/ExpenseContext';
import { getCategories } from '../../utils/categories';
import TransactionItem from './TransactionItem';

export default function TransactionList() {
  const { transactions } = useExpense();
  const [activeType, setActiveType] = useState('all');
  const [activeCategory, setActiveCategory] = useState('all');
  const [sort, setSort] = useState('newest');

  function handleTypeChange(type) {
    setActiveType(type);
    setActiveCategory('all');
  }

  const list = useMemo(() => {
    let filtered = transactions;
    if (activeType !== 'all') filtered = filtered.filter((t) => t.type === activeType);
    if (activeCategory !== 'all') filtered = filtered.filter((t) => t.category === activeCategory);

    const sorted = [...filtered];
    switch (sort) {
      case 'newest': sorted.sort((a, b) => b.id - a.id); break;
      case 'oldest': sorted.sort((a, b) => a.id - b.id); break;
      case 'high':   sorted.sort((a, b) => b.total - a.total); break;
      case 'low':    sorted.sort((a, b) => a.total - b.total); break;
      default: break;
    }
    return sorted;
  }, [transactions, activeType, activeCategory, sort]);

  const categoryOptions = activeType !== 'all' ? getCategories(activeType) : null;

  return (
    <div className="card list-card">
      <div className="card-head">
        <h2 className="card-title">📋 Transaction List</h2>
        <div className="list-controls">
          <select className="mini-select" value={sort} onChange={(e) => setSort(e.target.value)}>
            <option value="newest">Newest</option>
            <option value="oldest">Oldest</option>
            <option value="high">Highest</option>
            <option value="low">Lowest</option>
          </select>
        </div>
      </div>

      <div className="cat-filters">
        <button className={`cat-btn${activeType === 'all' ? ' active' : ''}`} onClick={() => handleTypeChange('all')}>All</button>
        <button className={`cat-btn${activeType === 'expense' ? ' active' : ''}`} onClick={() => handleTypeChange('expense')}>💳 Expenses</button>
        <button className={`cat-btn${activeType === 'income' ? ' active' : ''}`} onClick={() => handleTypeChange('income')}>💵 Income</button>
      </div>

      {categoryOptions && (
        <div className="cat-filters">
          <button className={`cat-btn${activeCategory === 'all' ? ' active' : ''}`} onClick={() => setActiveCategory('all')}>All Categories</button>
          {Object.entries(categoryOptions).map(([key, meta]) => (
            <button
              key={key}
              className={`cat-btn${activeCategory === key ? ' active' : ''}`}
              onClick={() => setActiveCategory(key)}
            >
              {meta.emoji} {meta.label}
            </button>
          ))}
        </div>
      )}

      <div className="card-body">
        {list.length === 0 ? (
          <div className="empty-state">
            <div className="empty-icon">🧾</div>
            {activeType === 'all' && activeCategory === 'all' ? (
              <p>No transactions added yet.<br />Fill in the form above to get started.</p>
            ) : (
              <p>No items match this filter.</p>
            )}
          </div>
        ) : (
          list.map((item) => <TransactionItem key={item.id} item={item} />)
        )}
      </div>
    </div>
  );
}
