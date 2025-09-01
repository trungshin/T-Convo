// /lib/api.ts
import  nextConfig from 'next.config';
import axios, { AxiosError, AxiosRequestConfig, AxiosResponse } from 'axios';
import { store } from '@/store'; 
import { authActions } from '@/store/authSlice';
import { StatusCodes } from 'http-status-codes';

// Config constants
const API_BASE = nextConfig?.env?.NEXT_PUBLIC_API_BASE;
const REFRESH_ENDPOINT = '/auth/refresh';
const MAX_RETRIES = 2;

// Tạo Axios instance
const api = axios.create({
  baseURL: API_BASE,
  withCredentials: true,
});

// Request interceptor: Gắn token từ store
api.interceptors.request.use((config) => {
  const token = store.getState().auth.accessToken;
  if (token && config.headers) {
    config.headers['Authorization'] = `Bearer ${token}`;
  }
  return config;
});

// Biến cho refresh logic
let isRefreshing = false;
let failedQueue: Array<{
  resolve: (config: AxiosRequestConfig) => void;
  reject: (error: AxiosError) => void;
  config: AxiosRequestConfig;
}> = [];

// Helper: Xử lý queue các request thất bại
const processQueue = (error: AxiosError | null, token: string | null = null) => {
  failedQueue.forEach(({ resolve, reject, config }) => {
    if (error) {
      reject(error);
    } else if (token && config.headers) {
      config.headers['Authorization'] = `Bearer ${token}`;
      resolve(config);
    }
  });
  failedQueue = [];
};

// Helper: Refresh token
const refreshAccessToken = async (): Promise<string> => {
  const refreshResponse = await axios.post(`${API_BASE}${REFRESH_ENDPOINT}`, {}, { withCredentials: true });
  const newToken = refreshResponse.data?.accessToken;

  if (!newToken) {
    throw new Error('No access token found in refresh response');
  }
  store.dispatch(authActions.setAccessToken(newToken));
  return newToken;
};

// Response interceptor: Xử lý lỗi 401 với refresh token
api.interceptors.response.use(
  (response: AxiosResponse) => response,
  async (error: AxiosError) => {
    const originalRequest: AxiosRequestConfig & { _retryCount?: number } = error.config || {};
    originalRequest._retryCount = originalRequest._retryCount || 0;

    if (
      error.response?.status === StatusCodes.UNAUTHORIZED &&
      originalRequest._retryCount < MAX_RETRIES
    ) {
      if (isRefreshing) {
        // Queue request nếu refresh đang diễn ra
        return new Promise((resolve, reject) => {
          failedQueue.push({
            resolve: (config) => resolve(api(config)),
            reject,
            config: originalRequest,
          });
        });
      }

      originalRequest._retryCount += 1;
      isRefreshing = true;

      try {
        const newToken = await refreshAccessToken();
        processQueue(null, newToken);
        if (originalRequest.headers) {
          originalRequest.headers['Authorization'] = `Bearer ${newToken}`;
        }
        return api(originalRequest);
      } catch (refreshError) {
        const axiosRefreshError = refreshError as AxiosError;
        console.error('Token refresh failed:', axiosRefreshError.message);
        processQueue(axiosRefreshError, null);
        store.dispatch(authActions.logout());
        return Promise.reject(axiosRefreshError);
      } finally {
        isRefreshing = false;
      }
    }
    return Promise.reject(error);
  }
);

export default api;