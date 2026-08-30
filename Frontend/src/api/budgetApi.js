import axiosInstance from './axiosInstance';

export async function fetchBudget() {
  const res = await axiosInstance.get('/budget');
  return res.data;
}

export async function saveBudget(budget, currency) {
  const res = await axiosInstance.put('/budget', { budget, currency });
  return res.data;
}
