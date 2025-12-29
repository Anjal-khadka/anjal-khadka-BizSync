import { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { api } from './api';

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [token, setToken] = useState(() => localStorage.getItem('token'));
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(Boolean(token));
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!token) return;
    setLoading(true);
    api
      .me(token)
      .then((data) => setUser(data.user))
      .catch(() => {
        setToken(null);
        localStorage.removeItem('token');
      })
      .finally(() => setLoading(false));
  }, [token]);

  const login = async (email, password) => {
    setError(null);
    const data = await api.login({ email, password });
    setToken(data.token);
    localStorage.setItem('token', data.token);
    setUser(data.user);
  };

  const register = async (name, email, password, role, businessName, phone, location) => {
    setError(null);
    const data = await api.register({ name, email, password, role, businessName, phone, location });
    setToken(data.token);
    localStorage.setItem('token', data.token);
    setUser(data.user);
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem('token');
  };

  const updateProfile = async (payload) => {
    setError(null);
    const cleanPayload = { ...payload };
    if (cleanPayload.password === '') delete cleanPayload.password;
    const data = await api.updateProfile(token, cleanPayload);
    setUser(data.user);
  };

  const value = useMemo(
    () => ({ user, token, loading, error, setError, login, register, logout, updateProfile }),
    [user, token, loading, error]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used inside AuthProvider');
  return ctx;
}
