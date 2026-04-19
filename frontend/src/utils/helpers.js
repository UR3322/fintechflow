// Format PKR currency using Intl.NumberFormat
export function formatPKR(amount) {
  return new Intl.NumberFormat('en-PK', {
    style: 'currency',
    currency: 'PKR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 2
  }).format(amount);
}

// Format date/time
export function formatDate(isoString) {
  const date = new Date(isoString);
  return new Intl.DateTimeFormat('en-PK', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  }).format(date);
}

// API base URL
export const API_BASE = import.meta.env.VITE_API_URL || '';
