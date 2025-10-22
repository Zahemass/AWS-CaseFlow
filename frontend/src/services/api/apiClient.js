import axios from 'axios';
import { API_BASE_URL } from './endpoints';
import { setupInterceptors } from './interceptors';

// Create axios instance
const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 30000,
  headers: { 'Content-Type': 'application/json' },
});

// Attach interceptors for auth + logging
setupInterceptors(apiClient);

export default apiClient;
