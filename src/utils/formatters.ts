export function formatCurrency(amount: number): string {
  if (amount == null || isNaN(amount)) amount = 0;
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 0,
  }).format(amount);
}

export function formatNumber(value: number): string {
  if (value == null || isNaN(value)) return '0';
  return new Intl.NumberFormat('en-US').format(value);
}

export function formatPercent(value: number): string {
  if (value == null || isNaN(value)) return '0%';
  return `${Math.round(value)}%`;
}
