// export const setToken = (token) => {
//     localStorage.setItem('authToken', token);
// };

// export const getToken = () => {
//     return localStorage.getItem('authToken');
// };

// export const clearToken = () => {
//     localStorage.removeItem('authToken');
// };

// export const isAuthenticated = () => {
//     return !!getToken();
// };
// utils/axiosConfig.js
import axios from 'axios';

const instance = axios.create({
  baseURL: 'http://localhost/api/',
  headers: {
    'Content-Type': 'application/json',
  },
});

instance.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default instance;
