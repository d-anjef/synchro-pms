import { createContext, useState, useEffect, useCallback } from 'react';
import { authService } from '../services/authServices';
import { initSocket, disconnectSocket } from '../api/socket';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const loadUser = useCallback(async () => {
    const token = localStorage.getItem('token');
    if (!token) {
      setLoading(false);
      return;
    }
    try {
      const res = await authService.getMe();
      setUser(res.user);
      initSocket(token);
    } catch (err) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadUser();
  }, [loadUser]);

  const login = async (credentials) => {
    const res = await authService.login(credentials);
    localStorage.setItem('token', res.token);
    localStorage.setItem('user', JSON.stringify(res.user));
    setUser(res.user);
    initSocket(res.token);
    return res;
  };

  const register = async (data) => {
    const res = await authService.register(data);
    localStorage.setItem('token', res.token);
    localStorage.setItem('user', JSON.stringify(res.user));
    setUser(res.user);
    initSocket(res.token);
    return res;
  };

  const logout = async () => {
    try {
      await authService.logout();
    } catch (_) {}
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
    disconnectSocket();
  };

  const updateUser = (updates) => {
    setUser((prev) => ({ ...prev, ...updates }));
    localStorage.setItem('user', JSON.stringify({ ...user, ...updates }));
  };

  return (
    <AuthContext.Provider
      value={{ user, loading, login, register, logout, updateUser, loadUser }}
    >
      {children}
    </AuthContext.Provider>
  );
};