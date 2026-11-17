import { createContext, useContext, useState, useEffect } from 'react';
import { loginUser, registerUser } from '../services/api';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('token'));
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const storedToken = localStorage.getItem('token');
    const storedUser = localStorage.getItem('user');
    if (storedToken && storedUser) {
      try {
        setToken(storedToken);
        setUser(JSON.parse(storedUser));
      } catch {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
      }
    }
    setLoading(false);
  }, []);

  const login = async (email, password) => {
    const res = await loginUser({ email, password });
    const data = res.data;
    setToken(data.token);
    setUser(data.user || { _id: data._id, id: data._id, name: data.name, email: data.email, role: data.role });
    localStorage.setItem('token', data.token);
    localStorage.setItem('user', JSON.stringify(data.user || { _id: data._id, id: data._id, name: data.name, email: data.email, role: data.role }));
    return data;
  };

  const register = async (name, email, password) => {
    const res = await registerUser({ name, email, password });
    const data = res.data;
    setToken(data.token);
    setUser(data.user || { _id: data._id, id: data._id, name: data.name, email: data.email, role: data.role });
    localStorage.setItem('token', data.token);
    localStorage.setItem('user', JSON.stringify(data.user || { _id: data._id, id: data._id, name: data.name, email: data.email, role: data.role }));
    return data;
  };

  const logout = () => {
    setToken(null);
    setUser(null);
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  };

  const isAdmin = user?.role === 'admin';

  return (
    <AuthContext.Provider value={{ user, token, login, register, logout, isAdmin, loading }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
