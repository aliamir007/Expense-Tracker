// Category metadata for expenses and income.
// Keys must match what's sent to the backend in `category`.

export const EXPENSE_CATEGORIES = {
  food:          { emoji: '🍔', label: 'Food',        color: '#ef4444' },
  transport:     { emoji: '🚗', label: 'Transport',   color: '#f59e0b' },
  shopping:      { emoji: '🛍️', label: 'Shopping',    color: '#3b6ef8' },
  health:        { emoji: '💊', label: 'Health',      color: '#22c55e' },
  bills:         { emoji: '⚡', label: 'Bills',       color: '#8b5cf6' },
  education:     { emoji: '📚', label: 'Education',   color: '#06b6d4' },
  entertainment: { emoji: '🎮', label: 'Fun',         color: '#ec4899' },
  other:         { emoji: '📦', label: 'Other',       color: '#9ca3af' },
};

export const INCOME_CATEGORIES = {
  salary:     { emoji: '💼', label: 'Salary',     color: '#22c55e' },
  freelance:  { emoji: '🧑‍💻', label: 'Freelance',  color: '#3b6ef8' },
  business:   { emoji: '🏢', label: 'Business',   color: '#8b5cf6' },
  investment: { emoji: '📈', label: 'Investment', color: '#06b6d4' },
  gift:       { emoji: '🎁', label: 'Gift',       color: '#ec4899' },
  other:      { emoji: '📦', label: 'Other',      color: '#9ca3af' },
};

export function getCategories(type) {
  return type === 'income' ? INCOME_CATEGORIES : EXPENSE_CATEGORIES;
}

export function getCategoryMeta(type, cat) {
  const map = getCategories(type);
  return map[cat] || map.other;
}

export const PRIORITIES = {
  high:   { label: 'High',   className: 'tag-pri-high' },
  medium: { label: 'Medium', className: 'tag-pri-medium' },
  low:    { label: 'Low',    className: 'tag-pri-low' },
};

export const TIPS = [
  'Try the 50/30/20 rule — 50% for needs, 30% for wants, and 20% straight into savings.',
  'Review your biggest category every week. Even trimming 10% adds up fast.',
  'Always log expenses immediately — small amounts are easy to forget but add up quickly.',
  'Set aside your savings first before you start spending. Pay yourself first!',
  'Tracking consistently is the #1 habit of people who meet their financial goals.',
  'High-priority expenses should always be budgeted before discretionary spending.',
  'Consider whether each purchase is a need or a want before you add it.',
  'Great job tracking! Awareness of your spending is the first step to financial freedom.',
];
