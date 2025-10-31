/**
 * LocalStorage Keys Constants
 */

export const STORAGE_KEYS = {
  TOKEN: 'token',
  USER: 'user',
  THEME: 'theme',
  PREFERENCES: 'preferences',
};

export const storage = {
  /**
   * Get value from localStorage
   * @param {string} key - Storage key
   * @param {boolean} parseJson - Whether to parse JSON (default: true)
   * @returns {any} Stored value or null
   */
  get: (key, parseJson = true) => {
    try {
      const item = localStorage.getItem(key);
      if (!item) return null;
      
      if (parseJson) {
        try {
          return JSON.parse(item);
        } catch {
          // If JSON parsing fails, return raw string (for backward compatibility with token)
          return item;
        }
      }
      
      return item;
    } catch (error) {
      console.error(`Error reading from localStorage for key "${key}":`, error);
      return null;
    }
  },

  /**
   * Set value in localStorage
   * @param {string} key - Storage key
   * @param {any} value - Value to store
   * @param {boolean} stringify - Whether to stringify JSON (default: true)
   * @returns {boolean} Success status
   */
  set: (key, value, stringify = true) => {
    try {
      const item = stringify ? JSON.stringify(value) : value;
      localStorage.setItem(key, item);
      return true;
    } catch (error) {
      console.error(`Error writing to localStorage for key "${key}":`, error);
      return false;
    }
  },

  /**
   * Remove value from localStorage
   * @param {string} key - Storage key
   * @returns {boolean} Success status
   */
  remove: (key) => {
    try {
      localStorage.removeItem(key);
      return true;
    } catch (error) {
      console.error(`Error removing from localStorage for key "${key}":`, error);
      return false;
    }
  },

  /**
   * Clear all localStorage
   * @returns {boolean} Success status
   */
  clear: () => {
    try {
      localStorage.clear();
      return true;
    } catch (error) {
      console.error('Error clearing localStorage:', error);
      return false;
    }
  },
};

