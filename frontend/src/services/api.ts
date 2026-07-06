import axios, { type AxiosError, type InternalAxiosRequestConfig } from 'axios';
import {
  clearTokens,
  getAccessToken,
  getRefreshToken,
  isTokenExpired,
  setTokens,
} from '@/utils/tokenStorage';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL ?? 'http://localhost:8000/api/';

export const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

let isRefreshing = false;
let refreshQueue: Array<(token: string | null) => void> = [];

function processQueue(token: string | null) {
  refreshQueue.forEach((callback) => callback(token));
  refreshQueue = [];
}

function redirectToLogin() {
  clearTokens();
  const loginPath = '/login';
  if (window.location.pathname !== loginPath) {
    window.location.href = loginPath;
  }
}

async function refreshAccessToken(): Promise<string | null> {
  const refresh = getRefreshToken();
  if (!refresh) return null;

  try {
    const { data } = await axios.post<{ access: string }>(
      `${API_BASE_URL}auth/token/refresh/`,
      { refresh },
      { headers: { 'Content-Type': 'application/json' } },
    );
    setTokens(data.access, refresh);
    return data.access;
  } catch {
    return null;
  }
}

api.interceptors.request.use(
  async (config: InternalAxiosRequestConfig) => {
    let token = getAccessToken();

    if (token && isTokenExpired(token)) {
      if (!isRefreshing) {
        isRefreshing = true;
        token = await refreshAccessToken();
        isRefreshing = false;
        processQueue(token);
      } else {
        token = await new Promise<string | null>((resolve) => {
          refreshQueue.push(resolve);
        });
      }
    }

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error: AxiosError) => Promise.reject(error),
);

api.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const originalRequest = error.config as InternalAxiosRequestConfig & { _retry?: boolean };

    if (error.response?.status === 401 && originalRequest && !originalRequest._retry) {
      originalRequest._retry = true;

      if (!isRefreshing) {
        isRefreshing = true;
        const newToken = await refreshAccessToken();
        isRefreshing = false;
        processQueue(newToken);

        if (newToken) {
          originalRequest.headers.Authorization = `Bearer ${newToken}`;
          return api(originalRequest);
        }
      } else {
        const newToken = await new Promise<string | null>((resolve) => {
          refreshQueue.push(resolve);
        });

        if (newToken) {
          originalRequest.headers.Authorization = `Bearer ${newToken}`;
          return api(originalRequest);
        }
      }

      redirectToLogin();
    }

    return Promise.reject(error);
  },
);

export default api;
