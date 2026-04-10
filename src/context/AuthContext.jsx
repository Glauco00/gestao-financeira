import React, { createContext, useState, useEffect, useContext } from 'react';
import * as api from '../services/api';

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loadingInitial, setLoadingInitial] = useState(true);

  // Initialize session from API if a token exists in localStorage
  useEffect(() => {
    async function loadUser() {
      const token = localStorage.getItem('token');
      if (token) {
        try {
          const userData = await api.getMe();
          if (userData && userData.data && userData.data.user) {
            setUser(userData.data.user);
          }
        } catch (error) {
          console.error("Failed to load user session, token might be invalid/expired.", error);
          api.logout(); // removes token and user from localStorage
          setUser(null);
        }
      }
      setLoadingInitial(false);
    }
    loadUser();
  }, []);

  async function login(credentials) {
    try {
      const response = await api.login(credentials);
      if (response && response.data && response.data.user) {
        setUser(response.data.user);
        return response.data.user;
      }
      throw new Error("Invalid response format");
    } catch (error) {
      throw error;
    }
  }

  async function register(userData) {
    try {
      const response = await api.register(userData);
      // After registering, API might send token back, if not we login implicitly
      if (response.data && response.data.token) {
        localStorage.setItem('token', response.data.token);
        setUser(response.data.user);
        return response.data.user;
      } else {
        // Fallback: Just login right after registration so user isn't forced to re-type
        return await login({ email: userData.email, password: userData.password });
      }
    } catch (error) {
      throw error;
    }
  }

  function logout() {
    api.logout();
    setUser(null);
  }

  return (
    <AuthContext.Provider value={{ user, login, logout, register, loadingInitial }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}