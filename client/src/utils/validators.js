/**
 * Validation Utility Functions
 */

/**
 * Validate email address
 * @param {string} email - Email to validate
 * @returns {boolean} True if valid email
 */
export const isValidEmail = (email) => {
  if (!email) return false;
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

/**
 * Validate password strength
 * @param {string} password - Password to validate
 * @param {number} minLength - Minimum length (default: 8)
 * @returns {object} Validation result with isValid and message
 */
export const validatePassword = (password, minLength = 8) => {
  if (!password) {
    return { isValid: false, message: 'Password is required.' };
  }

  if (password.length < minLength) {
    return {
      isValid: false,
      message: `Password must be at least ${minLength} characters long.`,
    };
  }

  return { isValid: true, message: '' };
};

/**
 * Validate required field
 * @param {any} value - Value to validate
 * @param {string} fieldName - Name of the field
 * @returns {object} Validation result
 */
export const validateRequired = (value, fieldName = 'Field') => {
  if (value === null || value === undefined || value === '') {
    return { isValid: false, message: `${fieldName} is required.` };
  }
  return { isValid: true, message: '' };
};

/**
 * Validate number
 * @param {any} value - Value to validate
 * @param {object} options - Validation options (min, max, allowFloat)
 * @returns {object} Validation result
 */
export const validateNumber = (value, options = {}) => {
  const { min, max, allowFloat = true } = options;

  if (value === null || value === undefined || value === '') {
    return { isValid: false, message: 'This field is required.' };
  }

  const num = allowFloat ? parseFloat(value) : parseInt(value, 10);

  if (isNaN(num)) {
    return { isValid: false, message: 'Please enter a valid number.' };
  }

  if (min !== undefined && num < min) {
    return { isValid: false, message: `Value must be at least ${min}.` };
  }

  if (max !== undefined && num > max) {
    return { isValid: false, message: `Value must be at most ${max}.` };
  }

  return { isValid: true, message: '' };
};

/**
 * Validate SKU format
 * @param {string} sku - SKU to validate
 * @returns {object} Validation result
 */
export const validateSKU = (sku) => {
  if (!sku || sku.trim() === '') {
    return { isValid: false, message: 'SKU is required.' };
  }

  if (sku.length < 3) {
    return { isValid: false, message: 'SKU must be at least 3 characters long.' };
  }

  return { isValid: true, message: '' };
};

/**
 * Validate phone number (Indian format)
 * @param {string} phone - Phone number to validate
 * @returns {object} Validation result
 */
export const validatePhone = (phone) => {
  if (!phone) {
    return { isValid: false, message: 'Phone number is required.' };
  }

  const phoneRegex = /^[6-9]\d{9}$/;
  const cleaned = phone.replace(/\D/g, '');

  if (cleaned.length !== 10 || !phoneRegex.test(cleaned)) {
    return { isValid: false, message: 'Please enter a valid 10-digit phone number.' };
  }

  return { isValid: true, message: '' };
};

