import React, { createContext, useContext, useState, useEffect } from 'react';
import { authAPI } from '../services/api';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('sales_ai_token'));
  const [loading, setLoading] = useState(true);

  // Load profile on mount if token exists
  useEffect(() => {
    const fetchUserProfile = async () => {
      if (!token) {
        // Auto-login as default demo rep if no saved user to provide an immediate seamless experience
        try {
          const res = await authAPI.demoLogin('Sales Rep');
          if (res.data.success) {
            setUser(res.data.user);
            setToken(res.data.token);
            localStorage.setItem('sales_ai_token', res.data.token);
          }
        } catch (err) {
          console.warn('Demo login failed on mount:', err.message);
        } finally {
          setLoading(false);
        }
        return;
      }

      try {
        const res = await authAPI.getMe();
        if (res.data.success) {
          setUser(res.data.user);
        }
      } catch (err) {
        console.warn('Failed to load session:', err.message);
        localStorage.removeItem('sales_ai_token');
        setToken(null);
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    fetchUserProfile();
  }, [token]);

  const login = async (email, password) => {
    const res = await authAPI.login({ email, password });
    if (res.data.success) {
      setUser(res.data.user);
      setToken(res.data.token);
      localStorage.setItem('sales_ai_token', res.data.token);
    }
    return res.data;
  };

  const register = async (userData) => {
    const res = await authAPI.register(userData);
    if (res.data.success) {
      setUser(res.data.user);
      setToken(res.data.token);
      localStorage.setItem('sales_ai_token', res.data.token);
    }
    return res.data;
  };

  const demoLogin = async (role = 'Sales Rep') => {
    const res = await authAPI.demoLogin(role);
    if (res.data.success) {
      setUser(res.data.user);
      setToken(res.data.token);
      localStorage.setItem('sales_ai_token', res.data.token);
    }
    return res.data;
  };

  const logout = () => {
    localStorage.removeItem('sales_ai_token');
    setToken(null);
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, token, loading, login, register, demoLogin, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
