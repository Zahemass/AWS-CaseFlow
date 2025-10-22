// src/services/api/interceptors.js
import { getToken, clearToken } from '../auth/tokenManager';
import { signOut } from 'aws-amplify/auth'; // ✅ modular import (Amplify v6)

export const setupInterceptors = (client) => {
  // ✅ Attach Authorization header before each request
  client.interceptors.request.use(async (config) => {
    const token = await getToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  });

  // ✅ Handle 401 errors globally
  client.interceptors.response.use(
    (response) => response,
    async (error) => {
      if (error.response?.status === 401) {
        try {
          // Proper v6 sign out
          await signOut();
        } catch (err) {
          console.warn('Sign-out error:', err);
        }
        clearToken();
        window.location.href = '/login';
      }
      return Promise.reject(error);
    }
  );
};
