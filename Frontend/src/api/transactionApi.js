import axiosInstance from './axiosInstance';

export async function fetchTransactions() {
  const res = await axiosInstance.get('/transactions');
  return res.data;
}

export async function createTransaction(payload) {
  const res = await axiosInstance.post('/transactions', payload);
  return res.data;
}

export async function updateTransaction(id, payload) {
  const res = await axiosInstance.put(`/transactions/${id}`, payload);
  return res.data;
}

export async function deleteTransaction(id) {
  const res = await axiosInstance.delete(`/transactions/${id}`);
  return res.data;
}
