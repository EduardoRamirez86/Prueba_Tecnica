import React, { useState } from 'react';
import { AuthContext } from './AuthContextInstance';
import authService from '../api/authService';
import { toastSuccess } from '../components/feedback/alerts';

export const AuthProvider = ({ children }) => {
  // Inicialización limpia y perezosa leyendo una sola vez de localStorage
  const [token, setToken] = useState(() => localStorage.getItem('token'));
  const [user, setUser] = useState(() => {
    try {
      const storedUser = localStorage.getItem('user');
      return storedUser ? JSON.parse(storedUser) : null;
    } catch {
      return null;
    }
  });
  const [isLoading] = useState(false);

  /**
   * Ejecuta el login conectando con el backend en .NET 8.
   * @param {string} email
   * @param {string} contrasena
   */
  const login = async (email, contrasena) => {
    const data = await authService.login(email, contrasena);

    const nombreFormateado = data.email
      ? data.email.split('@')[0].replace('.', ' ').replace(/(^\w|\s\w)/g, (m) => m.toUpperCase())
      : data.rol;

    const userData = {
      email: data.email,
      rol: data.rol,
      nombre: nombreFormateado,
    };

    localStorage.setItem('token', data.token);
    localStorage.setItem('user', JSON.stringify(userData));

    setToken(data.token);
    setUser(userData);

    toastSuccess(`Bienvenido, ${userData.nombre}`);
    return data;
  };

  /**
   * Cierra la sesión activa y purga el almacenamiento local.
   */
  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setToken(null);
    setUser(null);
    window.location.href = '/login';
  };

  const isAuthenticated = Boolean(token);
  const isAdmin = user?.rol === 'Admin';

  const value = {
    user,
    token,
    isAuthenticated,
    isAdmin,
    isLoading,
    login,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export default AuthProvider;
