import axios from "axios";

export const API_URL = "http://order-space.lantanajayadigital.cloud/api"
export const STORAGE_URL = "http://order-space.lantanajayadigital.cloud/storage"

const axiosInstance = axios.create({
  baseURL: API_URL,
  withCredentials: true,
});

axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("auth_token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

axiosInstance.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    // Don't redirect on login/register endpoints
    const isAuthEndpoint = error.config?.url?.includes('/login') || 
                          error.config?.url?.includes('/register');
    
    if (error.response?.status === 401 && !isAuthEndpoint) {
      console.error('401 Unauthorized - User not authenticated');
      // Clear invalid token
      localStorage.removeItem("auth_token");
      localStorage.removeItem("user_data");
      // Only redirect if not already on login page
      if (typeof window !== 'undefined' && window.location.pathname !== '/login') {
        window.location.href = '/login';
      }
    } else if (error.response?.status === 403) {
      console.error('403 Forbidden - Authentication or authorization issue');
      console.error('Request URL:', error.config?.url);
      console.error('Request headers:', error.config?.headers);
    }
    return Promise.reject(error);
  }
);

export { axiosInstance };
