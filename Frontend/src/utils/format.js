export function formatCurrency(amount, symbol = 'Rs') {
  const n = Number(amount) || 0;
  return `${symbol} ${n.toLocaleString('en-PK', {
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  })}`;
}

export const CURRENCIES = [
  { code: 'PKR', symbol: 'Rs',  flag: '🇵🇰', label: 'Pakistani Rupee' },
  { code: 'USD', symbol: '$',   flag: '🇺🇸', label: 'US Dollar' },
  { code: 'EUR', symbol: '€',   flag: '🇪🇺', label: 'Euro' },
  { code: 'GBP', symbol: '£',   flag: '🇬🇧', label: 'British Pound' },
  { code: 'AED', symbol: 'د.إ', flag: '🇦🇪', label: 'UAE Dirham' },
  { code: 'SAR', symbol: '﷼',  flag: '🇸🇦', label: 'Saudi Riyal' },
  { code: 'INR', symbol: '₹',   flag: '🇮🇳', label: 'Indian Rupee' },
];

export function formatDate(date) {
  return new Date(date).toLocaleDateString('en-PK', {
    weekday: 'short', day: 'numeric', month: 'short', year: 'numeric',
  });
}
