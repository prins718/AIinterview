import React, { createContext, useContext, useState, useEffect } from 'react';
import { api } from '../utils/api.js';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Auto load profile on startup if token exists
  useEffect(() => {
    const initializeAuth = async () => {
      const token = localStorage.getItem('user_jwt_token');
      if (token) {
        try {
          const profile = await api.get('/api/auth/profile');
          setUser(profile);
        } catch (error) {
          console.warn('Session restoration failed, clearing token:', error.message);
          localStorage.removeItem('user_jwt_token');
        }
      }
      setLoading(false);
    };

    initializeAuth();
  }, []);

  const login = async (email, password) => {
    setLoading(true);
    try {
      const data = await api.post('/api/auth/login', { email, password });
      localStorage.setItem('user_jwt_token', data.token);
      setUser(data.user);
      setLoading(false);
      return data.user;
    } catch (error) {
      setLoading(false);
      throw error;
    }
  };

  const signup = async (username, email, password) => {
    setLoading(true);
    try {
      const data = await api.post('/api/auth/register', { username, email, password });
      localStorage.setItem('user_jwt_token', data.token);
      setUser(data.user);
      setLoading(false);
      return data.user;
    } catch (error) {
      setLoading(false);
      throw error;
    }
  };

  const logout = () => {
    localStorage.removeItem('user_jwt_token');
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, signup, logout }}>
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
