import axios, { AxiosRequestConfig, AxiosResponse } from 'axios';
import { API_BASE_URL, API_ENDPOINTS } from './endpoints';

export { API_BASE_URL, API_ENDPOINTS };

// Centralized Axios Instance with interceptors
export const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 15000,
});

// Automatically inject JWT token from localStorage on client-side requests
apiClient.interceptors.request.use(
  (config) => {
    if (typeof window !== 'undefined') {
      const token = localStorage.getItem('token');
      if (token && !config.headers.Authorization) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Unified request helper
export async function fetchApi<T = any>(
  endpoint: string,
  config: AxiosRequestConfig = {}
): Promise<T> {
  const url = endpoint.startsWith('http') ? endpoint : `${API_BASE_URL}${endpoint}`;
  const response: AxiosResponse<T> = await apiClient({
    url,
    ...config,
  });
  return response.data;
}

export default apiClient;
