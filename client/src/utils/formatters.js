/**
 * Formatting Utility Functions
 */

/**
 * Format currency amount
 * @param {number} amount - Amount to format
 * @param {string} currency - Currency symbol (default: '₹')
 * @returns {string} Formatted currency string
 */
export const formatCurrency = (amount, currency = '₹') => {
  if (amount === null || amount === undefined || isNaN(amount)) {
    return `${currency}0`;
  }
  return `${currency}${Number(amount).toLocaleString('en-IN', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;
};

/**
 * Format number with commas
 * @param {number} num - Number to format
 * @returns {string} Formatted number string
 */
export const formatNumber = (num) => {
  if (num === null || num === undefined || isNaN(num)) {
    return '0';
  }
  return Number(num).toLocaleString('en-IN');
};

/**
 * Format date string
 * @param {string|Date} date - Date to format
 * @param {string} format - Format type ('short' | 'long' | 'time')
 * @returns {string} Formatted date string
 */
export const formatDate = (date, format = 'short') => {
  if (!date) return '';

  const dateObj = typeof date === 'string' ? new Date(date) : date;

  if (isNaN(dateObj.getTime())) return '';

  const options = {
    short: { year: 'numeric', month: 'short', day: 'numeric' },
    long: { year: 'numeric', month: 'long', day: 'numeric' },
    time: { year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' },
  };

  return dateObj.toLocaleDateString('en-IN', options[format] || options.short);
};

/**
 * Format percentage
 * @param {number} value - Value to format as percentage
 * @param {number} decimals - Number of decimal places (default: 2)
 * @returns {string} Formatted percentage string
 */
export const formatPercentage = (value, decimals = 2) => {
  if (value === null || value === undefined || isNaN(value)) {
    return '0%';
  }
  return `${Number(value).toFixed(decimals)}%`;
};

/**
 * Truncate text with ellipsis
 * @param {string} text - Text to truncate
 * @param {number} maxLength - Maximum length
 * @returns {string} Truncated text
 */
export const truncateText = (text, maxLength = 50) => {
  if (!text || text.length <= maxLength) return text;
  return `${text.substring(0, maxLength)}...`;
};

/**
 * Capitalize first letter
 * @param {string} str - String to capitalize
 * @returns {string} Capitalized string
 */
export const capitalize = (str) => {
  if (!str) return '';
  return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
};

/**
 * Format SKU for display
 * @param {string} sku - SKU string
 * @returns {string} Formatted SKU
 */
export const formatSKU = (sku) => {
  if (!sku) return '';
  return sku.toUpperCase().trim();
};

