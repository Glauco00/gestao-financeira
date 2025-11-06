import axios from 'axios';

const api = axios.create({
  baseURL: 'https://api.seuservidor.com', // Substitua pela URL da sua API
  headers: {
    'Content-Type': 'application/json',
  },
});

export const fetchTransactions = async () => {
  const response = await api.get('/transacoes');
  return response.data;
};

export const addTransaction = async (transaction) => {
  const response = await api.post('/transacoes', transaction);
  return response.data;
};

export const deleteTransaction = async (id) => {
  await api.delete(`/transacoes/${id}`);
};

export const updateTransaction = async (id, transaction) => {
  const response = await api.put(`/transacoes/${id}`, transaction);
  return response.data;
};