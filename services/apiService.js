import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

const API_BASE_URL = process.env.EXPO_PUBLIC_API_URL || 'https://caitlyn-unransomable-reprovingly.ngrok-free.dev/api';

class ApiService {
  constructor() {
    this.api = axios.create({
      baseURL: API_BASE_URL,
      timeout: 10000,
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
    });

    this.isRefreshing = false;
    this.failedQueue = [];

    this.setupInterceptors();
  }

  setupInterceptors() {
    // Request interceptor - add auth token
    this.api.interceptors.request.use(
      async (config) => {
        const token = await this.getToken();
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
      },
      (error) => {
        return Promise.reject(error);
      }
    );

    // Response interceptor - handle 401 and errors
    this.api.interceptors.response.use(
      (response) => response,
      async (error) => {
        const originalRequest = error.config;

        // Handle 401 Unauthorized
        if (error.response?.status === 401 && !originalRequest._retry) {
          if (this.isRefreshing) {
            // Queue the request while refreshing
            return new Promise((resolve, reject) => {
              this.failedQueue.push({ resolve, reject });
            }).then((token) => {
              originalRequest.headers.Authorization = `Bearer ${token}`;
              return this.api(originalRequest);
            }).catch((err) => {
              return Promise.reject(err);
            });
          }

          originalRequest._retry = true;
          this.isRefreshing = true;

          try {
            const refreshToken = await this.getRefreshToken();
            if (!refreshToken) {
              throw new Error('No refresh token available');
            }

            const response = await axios.post(`${API_BASE_URL}/auth/refresh`, {
              refreshToken,
            });

            if (response.data?.success && response.data.data?.token) {
              const { token, refreshToken: newRefreshToken } = response.data.data;
              await this.setTokens(token, newRefreshToken);
              
              // Update header for original request
              originalRequest.headers.Authorization = `Bearer ${token}`;
              
              // Process queued requests
              this.failedQueue.forEach((prom) => {
                prom.resolve(token);
              });
              this.failedQueue = [];
              
              return this.api(originalRequest);
            } else {
              throw new Error('Invalid refresh response');
            }
          } catch (refreshError) {
            this.failedQueue.forEach((prom) => {
              prom.reject(refreshError);
            });
            this.failedQueue = [];
            
            await this.clearTokens();
            
            // Dispatch auth event for React Native
            if (typeof window !== 'undefined') {
              window.dispatchEvent(new CustomEvent('auth:unauthorized'));
            }
            
            return Promise.reject(new Error('Authentication required. Please login again.'));
          } finally {
            this.isRefreshing = false;
          }
        }

        // Handle other errors
        let errorMessage = 'An error occurred';
        
        if (error.response) {
          // Server responded with error
          const data = error.response.data;
          errorMessage = data?.message || data?.error?.message || data?.error || `Request failed: ${error.response.status}`;
          console.error('API Error:', {
            url: originalRequest?.url,
            status: error.response.status,
            data: data,
          });
        } else if (error.request) {
          // Request made but no response (network error)
          errorMessage = 'Network error. Please check your internet connection.';
          console.error('Network Error:', error.request);
        } else {
          // Something else happened
          errorMessage = error.message;
        }

        const enhancedError = new Error(errorMessage);
        enhancedError.originalError = error;
        enhancedError.status = error.response?.status;
        enhancedError.data = error.response?.data;
        
        return Promise.reject(enhancedError);
      }
    );
  }

  async getToken() {
    try {
      return await AsyncStorage.getItem('auth_token');
    } catch (error) {
      console.error('Error getting token:', error);
      return null;
    }
  }

  async getRefreshToken() {
    try {
      return await AsyncStorage.getItem('refresh_token');
    } catch (error) {
      console.error('Error getting refresh token:', error);
      return null;
    }
  }

  async setTokens(token, refreshToken) {
    try {
      if (token) await AsyncStorage.setItem('auth_token', token);
      if (refreshToken) await AsyncStorage.setItem('refresh_token', refreshToken);
    } catch (error) {
      console.error('Error setting tokens:', error);
    }
  }

  async clearTokens() {
    try {
      await AsyncStorage.removeItem('auth_token');
      await AsyncStorage.removeItem('refresh_token');
      await AsyncStorage.removeItem('user_data');
    } catch (error) {
      console.error('Error clearing tokens:', error);
    }
  }

  // HTTP methods
  async get(endpoint, config = {}) {
    const response = await this.api.get(endpoint, config);
    return response.data;
  }

  async post(endpoint, data, config = {}) {
    const response = await this.api.post(endpoint, data, config);
    return response.data;
  }

  async put(endpoint, data, config = {}) {
    const response = await this.api.put(endpoint, data, config);
    return response.data;
  }

  async patch(endpoint, data, config = {}) {
    const response = await this.api.patch(endpoint, data, config);
    return response.data;
  }

  async delete(endpoint, config = {}) {
    const response = await this.api.delete(endpoint, config);
    return response.data;
  }
}

// Create singleton instance
const apiService = new ApiService();

// Export helper functions for backwards compatibility
export const getAuthToken = () => apiService.getToken();
export const getRefreshToken = () => apiService.getRefreshToken();
export const clearTokens = () => apiService.clearTokens();
export const setTokens = (token, refreshToken) => apiService.setTokens(token, refreshToken);

// Export the service instance
export default apiService;