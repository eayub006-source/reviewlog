import axios from "axios";
import { getAccessToken, getRefreshToken, setAuthTokens, clearAuthTokens } from "@/utils/authStorage";
import { refreshAccessToken } from "@/services/tokenService";

const api = axios.create({
  baseURL: "https://reviewlog.onrender.com/api/",
  headers: {
    "Content-Type": "application/json",
  },
});

// Request interceptor to attach bearer token
api.interceptors.request.use(
  (config) => {
    const token = getAccessToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

let isRefreshing = false;
let failedQueue = [];

const processQueue = (error, token = null) => {
  failedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token);
    }
  });
  failedQueue = [];
};

// Response interceptor to handle auto token refresh on 401
api.interceptors.response.use(
  (response) => {
    return response;
  },
  async (error) => {
    const originalRequest = error.config;

    // Skip refresh token logic if the request is to login or register endpoints
    const isAuthRequest = originalRequest && (
      originalRequest.url?.includes("token/") || 
      originalRequest.url?.includes("register/")
    );

    // Check if error is 401, is not an auth request, and not already retried
    if (error.response?.status === 401 && originalRequest && !isAuthRequest && !originalRequest._retry) {
      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        })
          .then((token) => {
            originalRequest.headers.Authorization = `Bearer ${token}`;
            return api(originalRequest);
          })
          .catch((err) => {
            return Promise.reject(err);
          });
      }

      originalRequest._retry = true;
      isRefreshing = true;

      const refreshToken = getRefreshToken();
      if (!refreshToken) {
        isRefreshing = false;
        clearAuthTokens();
        return Promise.reject(error);
      }

      try {
        const tokens = await refreshAccessToken(refreshToken);
        setAuthTokens(tokens);
        const newAccessToken = tokens.access;
        
        processQueue(null, newAccessToken);
        
        originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
        return api(originalRequest);
      } catch (refreshError) {
        processQueue(refreshError, null);
        clearAuthTokens();
        return Promise.reject(refreshError);
      } finally {
        isRefreshing = false;
      }
    }

    return Promise.reject(error);
  }
);

export default api;