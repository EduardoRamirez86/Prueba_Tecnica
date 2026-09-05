/**
 * Formatea un valor numérico a moneda (USD) con separadores de miles y 2 decimales.
 * @param {number|string} value 
 * @returns {string} Ej: "$1,250.00"
 */
export const formatCurrency = (value) => {
  const num = typeof value === 'string' ? parseFloat(value) : value;
  if (num === null || num === undefined || isNaN(num)) return '$0.00';
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(num);
};

/**
 * Formatea un número con separadores de miles.
 * @param {number|string} value 
 * @returns {string} Ej: "1,450"
 */
export const formatNumber = (value) => {
  const num = typeof value === 'string' ? parseFloat(value) : value;
  if (num === null || num === undefined || isNaN(num)) return '0';
  return new Intl.NumberFormat('en-US').format(num);
};

/**
 * Formatea una fecha ISO a formato local legible (DD/MM/YYYY).
 * @param {string|Date} date 
 * @returns {string} Ej: "04/09/2026"
 */
export const formatDate = (date) => {
  if (!date) return '-';
  try {
    const d = new Date(date);
    return new Intl.DateTimeFormat('es-GT', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    }).format(d);
  } catch {
    return '-';
  }
};
