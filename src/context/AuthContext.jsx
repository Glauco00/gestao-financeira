import React, { createContext, useState, useEffect, useContext } from 'react';

const AuthContext = createContext();

function loadUsers() {
  try {
    const raw = localStorage.getItem('users');
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}
function saveUsers(list) {
  try {
    localStorage.setItem('users', JSON.stringify(list || []));
  } catch {}
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem('user')) || null;
    } catch {
      return null;
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem('user', JSON.stringify(user));
    } catch {}
  }, [user]);

  // login agora valida/recupera usuário cadastrado (se houver)
  async function login({ email, password } = {}) {
    const users = loadUsers();
    const found = users.find((u) => u.email === email);
    if (found) {
      // se existe senha cadastrada, valide
      if (found.password && password !== found.password) {
        throw new Error('Credenciais inválidas');
      }
      const u = {
        email: found.email,
        username: found.username,
        name: found.username || found.name || (found.email ? found.email.split('@')[0] : 'Usuário'),
      };
      setUser(u);
      return u;
    }
    // fallback compatível: aceita qualquer email e cria name a partir do email
    const u = { email, name: email ? email.split('@')[0] : 'Usuário' };
    setUser(u);
    return u;
  }

  // register agora armazena username + senha (mock) em 'users' e faz login
  async function register({ username, email, password } = {}) {
    const users = loadUsers();
    const idx = users.findIndex((u) => u.email === email);
    const newUser = {
      email,
      username: username || (email ? email.split('@')[0] : 'Usuário'),
      password: password || '',
    };
    if (idx >= 0) users[idx] = { ...users[idx], ...newUser };
    else users.push(newUser);
    saveUsers(users);

    // loga com os dados do registro
    const u = { email: newUser.email, username: newUser.username, name: newUser.username };
    setUser(u);
    return u;
  }

  function logout() {
    setUser(null);
  }

  return (
    <AuthContext.Provider value={{ user, login, logout, register }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}