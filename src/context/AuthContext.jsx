import React, { createContext, useState, useEffect, useContext, useMemo, useCallback } from 'react';
import * as api from '../services/api';

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loadingInitial, setLoadingInitial] = useState(true);

  // Carregar usuário inicial apenas se não estivermos no login e houver um token
  useEffect(() => {
    async function loadUser() {
      const token = localStorage.getItem('token');
      const isLoginPage = window.location.pathname === '/login';

      if (token && !isLoginPage) {
        try {
          const userData = await api.getMe();
          if (userData?.data?.user) {
            setUser(userData.data.user);
          }
        } catch (error) {
          console.error("Sessão expirada ou inválida:", error.message);
          localStorage.clear();
          setUser(null);
        }
      }
      setLoadingInitial(false);
    }
    loadUser();
  }, []);

  const login = useCallback(async (credentials) => {
    try {
      const response = await api.login(credentials);
      if (response?.data?.user) {
        setUser(response.data.user);
        return response.data.user;
      }
      throw new Error("Formato de resposta inválido");
    } catch (error) {
      throw error;
    }
  }, []);

  const logout = useCallback(() => {
    api.logout();
    setUser(null);
  }, []);

  const register = useCallback(async (userData) => {
    try {
      const response = await api.register(userData);
      if (response.data?.token) {
        localStorage.setItem('token', response.data.token);
        setUser(response.data.user);
        return response.data.user;
      } else {
        return await login({ email: userData.email, password: userData.password });
      }
    } catch (error) {
      throw error;
    }
  }, [login]);

  const updateProfile = useCallback(async (userData) => {
    const response = await api.updateProfile(userData);
    if (response?.success && response.data?.user) {
      setUser(response.data.user);
      return response.data.user;
    }
    throw new Error(response?.message || "Erro ao atualizar perfil");
  }, []);

  const value = useMemo(() => ({
    user,
    loadingInitial,
    login,
    logout,
    register,
    updateProfile
  }), [user, loadingInitial, login, logout, register, updateProfile]);

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth deve ser usado dentro de um AuthProvider');
  return context;
}