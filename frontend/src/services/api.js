import axios from 'axios';
import { useAuth } from '../context/AuthContext';

// Create a factory to attach token from context to requests
export const createApiClient = (token) => {
  const client = axios.create({
    baseURL: (process.env.REACT_APP_API_URL || 'http://localhost:8080') + '/api',
  });
  client.interceptors.request.use(async (config) => {
    if (token) config.headers.Authorization = `Bearer ${token}`;
    return config;
  });
  return client;
};
