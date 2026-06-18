import axios from 'axios';

export const adminApi = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || 'https://be-sudaiviet.onrender.com',
  headers: {
    'Content-Type': 'application/json',
    'X-Admin-Key': import.meta.env.VITE_ADMIN_KEY || 'sudaivietfptu',
  },
  timeout: 30000,
});

export const publicApi = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || 'https://be-sudaiviet.onrender.com',
  timeout: 30000,
});
