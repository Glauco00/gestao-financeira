import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || '/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor para adicionar token de autenticação
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Interceptor para tratar erros de autenticação
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// ==================== AUTH ====================
export const register = async (userData) => {
  const response = await api.post('/auth/register', userData);
  return response.data;
};

export const login = async (credentials) => {
  const response = await api.post('/auth/login', credentials);
  if (response.data.data?.token) {
    localStorage.setItem('token', response.data.data.token);
    localStorage.setItem('user', JSON.stringify(response.data.data.user));
  }
  return response.data;
};

export const getMe = async () => {
  const response = await api.get('/auth/me');
  return response.data;
};

export const logout = () => {
  localStorage.removeItem('token');
  localStorage.removeItem('user');
};

// ==================== TRANSACTIONS ====================
export const fetchTransactions = async (filters = {}) => {
  const params = new URLSearchParams(filters);
  const response = await api.get(`/transactions?${params}`);
  return response.data.data.transactions;
};

export const getTransaction = async (id) => {
  const response = await api.get(`/transactions/${id}`);
  return response.data.data.transaction;
};

export const addTransaction = async (transaction) => {
  const response = await api.post('/transactions', transaction);
  return response.data.data.transaction;
};

export const updateTransaction = async (id, transaction) => {
  const response = await api.put(`/transactions/${id}`, transaction);
  return response.data.data.transaction;
};

export const deleteTransaction = async (id) => {
  await api.delete(`/transactions/${id}`);
};

export const getTransactionStats = async (startDate, endDate) => {
  const response = await api.get('/transactions/stats', {
    params: { startDate, endDate }
  });
  return response.data.data.stats;
};

// ==================== ACCOUNTS ====================
export const fetchAccounts = async () => {
  const response = await api.get('/accounts');
  return response.data.data;
};

export const getAccount = async (id) => {
  const response = await api.get(`/accounts/${id}`);
  return response.data.data.account;
};

export const createAccount = async (account) => {
  const response = await api.post('/accounts', account);
  return response.data.data.account;
};

export const updateAccount = async (id, account) => {
  const response = await api.put(`/accounts/${id}`, account);
  return response.data.data.account;
};

export const deleteAccount = async (id) => {
  await api.delete(`/accounts/${id}`);
};

// ==================== CATEGORIES ====================
export const fetchCategories = async (type = null) => {
  const params = type ? `?type=${type}` : '';
  const response = await api.get(`/categories${params}`);
  return response.data.data.categories;
};

export const getCategory = async (id) => {
  const response = await api.get(`/categories/${id}`);
  return response.data.data.category;
};

export const createCategory = async (category) => {
  const response = await api.post('/categories', category);
  return response.data.data.category;
};

export const updateCategory = async (id, category) => {
  const response = await api.put(`/categories/${id}`, category);
  return response.data.data.category;
};

export const deleteCategory = async (id) => {
  await api.delete(`/categories/${id}`);
};

// ==================== USERS ====================
export const getProfile = async () => {
  const response = await api.get('/users/profile');
  return response.data.data.user;
};

export const updateProfile = async (userData) => {
  const response = await api.put('/users/profile', userData);
  return response.data.data.user;
};

export default api;