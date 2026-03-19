export const formatPrice = (amount) => {
  return new Intl.NumberFormat('es-MX', {
    style: 'currency',
    currency: 'MXN',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
};

export const formatDate = (dateString) => {
  const date = dateString instanceof Date ? dateString : new Date(dateString);
  return date.toLocaleDateString('es-MX', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
};

export const formatShortDate = (date) => {
  return date.toLocaleDateString('es-MX', {
    day: 'numeric',
    month: 'short',
  });
};

export const getDaysUntil = (date) => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const targetDate = new Date(date);
  targetDate.setHours(0, 0, 0, 0);
  const diffTime = targetDate - today;
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  return diffDays;
};

export const calculateCreditUsage = (creditUsed, creditLimit) => {
  return ((creditUsed / creditLimit) * 100).toFixed(0);
};

export const isAfterCutoffDate = (cutOffDate) => {
  if (!cutOffDate || cutOffDate === '—' || typeof cutOffDate !== 'string') return false;
  const cutoff = new Date(cutOffDate);
  if (Number.isNaN(cutoff.getTime())) return false;
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  cutoff.setHours(0, 0, 0, 0);
  return today > cutoff;
};

