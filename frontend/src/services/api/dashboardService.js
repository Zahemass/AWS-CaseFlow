// src/services/api/dashboardService.js
import axios from 'axios';

const API_URL = import.meta.env.VITE_API_BASE_URL; // e.g. from Amplify or API Gateway

export const getDashboardStats = async () => {
  const res = await axios.get(`${API_URL}/dashboard`);
  return res.data;
};
