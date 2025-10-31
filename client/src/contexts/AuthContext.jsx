import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { authService } from '../services/authService';

/**
 * Auth Context
 * Provides authentication state and methods throughout the application
 */

const AuthContext = createContext(null);

/**
 * Custom hook to access auth context
 * @returns {object} Auth context value
 * @throws {Error} If used outside AuthProvider
 */
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};

/**
 * Auth Provider Component
 * Manages authentication state and provides auth methods
 */
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  /**
   * Initialize auth state from storage
   */
  useEffect(() => {
    const initializeAuth = async () => {
      try {
        const token = authService.getStoredToken();
        const storedUser = authService.getStoredUser();

        if (token && storedUser) {
          // Set stored user immediately for faster initial render
          setUser(storedUser);
          
          // Validate token with backend
          try {
            const response = await authService.getCurrentUser();
            setUser(response.data.user);
          } catch (err) {
            // Token invalid - clear storage
            console.warn('Token validation failed:', err);
            authService.logout();
            setUser(null);
          }
        }
      } catch (err) {
        console.error('Auth initialization error:', err);
        setError(err);
      } finally {
        setLoading(false);
      }
    };

    initializeAuth();
  }, []);

  /**
   * Login user
   * @param {string} email - User email
   * @param {string} password - User password
   * @returns {Promise<object>} Login response
   */
  const login = useCallback(async (email, password) => {
    try {
      setError(null);
      setLoading(true);
      
      const response = await authService.login(email, password);
      authService.storeAuth(response.data.token, response.data.user);
      setUser(response.data.user);
      
      return response;
    } catch (error) {
      console.error('Auth context login error:', error);
      setError(error);
      throw error;
    } finally {
      setLoading(false);
    }
  }, []);

  /**
   * Register new user
   * @param {object} userData - User registration data
   * @returns {Promise<object>} Registration response
   */
  const register = useCallback(async (userData) => {
    try {
      setError(null);
      setLoading(true);
      
      const response = await authService.register(userData);
      authService.storeAuth(response.data.token, response.data.user);
      setUser(response.data.user);
      
      return response;
    } catch (error) {
      console.error('Auth context register error:', error);
      setError(error);
      throw error;
    } finally {
      setLoading(false);
    }
  }, []);

  /**
   * Logout user
   */
  const logout = useCallback(() => {
    authService.logout();
    setUser(null);
    setError(null);
  }, []);

  /**
   * Refresh user data from backend
   * @returns {Promise<object>} Updated user data
   */
  const refreshUser = useCallback(async () => {
    try {
      const response = await authService.getCurrentUser();
      setUser(response.data.user);
      return response.data.user;
    } catch (error) {
      console.error('Auth context refresh error:', error);
      throw error;
    }
  }, []);

  const value = {
    user,
    loading,
    error,
    login,
    register,
    logout,
    refreshUser,
    isAuthenticated: !!user,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};






