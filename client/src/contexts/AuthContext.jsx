import { createContext, useContext, useState, useEffect } from 'react';
import { authService } from '../services/authService';

const AuthContext = createContext(null);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check for stored auth on mount
    const token = authService.getStoredToken();
    const storedUser = authService.getStoredUser();

    if (token && storedUser) {
      setUser(storedUser);
      // Optionally validate token with backend
      authService.getCurrentUser()
        .then((response) => {
          setUser(response.data.user);
          setLoading(false);
        })
        .catch(() => {
          authService.logout();
          setUser(null);
          setLoading(false);
        });
    } else {
      setLoading(false);
    }
  }, []);

  const login = async (email, password) => {
    try {
      const response = await authService.login(email, password);
      authService.storeAuth(response.data.token, response.data.user);
      setUser(response.data.user);
      return response;
    } catch (error) {
      console.error('Auth context login error:', error);
      throw error;
    }
  };

  const register = async (userData) => {
    const response = await authService.register(userData);
    authService.storeAuth(response.data.token, response.data.user);
    setUser(response.data.user);
    return response;
  };

  const logout = () => {
    authService.logout();
    setUser(null);
  };

  const value = {
    user,
    loading,
    login,
    register,
    logout,
    isAuthenticated: !!user,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};






