import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import apiService, { clearTokens, getAuthToken } from '../services/apiService';

export const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [hasCheckedAuth, setHasCheckedAuth] = useState(false);

  useEffect(() => {
    if (!hasCheckedAuth) {
      initAuth();
    }
  }, [hasCheckedAuth]);

  const initAuth = async () => {
    try {
      setLoading(true);
      
      const token = await getAuthToken();
      
      if (token) {
        try {
          const response = await apiService.get('/auth/me');
          
          if (response?.success && response?.data?.user) {
            setUser(response.data.user);
            setIsAuthenticated(true);
          } else {
            setUser(null);
            setIsAuthenticated(false);
            await clearTokens();
          }
        } catch (err) {
          console.error('Auth verification error:', err);
          setUser(null);
          setIsAuthenticated(false);
          await clearTokens();
        }
      } else {
        setUser(null);
        setIsAuthenticated(false);
      }
    } catch (err) {
      console.error('Auth init error:', err);
      setUser(null);
      setIsAuthenticated(false);
      await clearTokens();
    } finally {
      setLoading(false);
      setHasCheckedAuth(true);
    }
  };

  const login = useCallback(async (email, password, twoFactorCode = null) => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await apiService.post('/auth/login', { 
        email, 
        password, 
        twoFactorCode: twoFactorCode || undefined 
      });
      
      if (response?.requiresTwoFactor) {
        return { requiresTwoFactor: true, userId: response.userId };
      }
      
      if (response?.success && response?.data) {
        // Store tokens
        if (response.data.token) {
          await AsyncStorage.setItem('auth_token', response.data.token);
        }
        if (response.data.refreshToken) {
          await AsyncStorage.setItem('refresh_token', response.data.refreshToken);
        }
        if (response.data.user) {
          await AsyncStorage.setItem('user_data', JSON.stringify(response.data.user));
          setUser(response.data.user);
        }
        
        setIsAuthenticated(true);
        return { success: true };
      }
      
      throw new Error(response?.message || 'Login failed');
    } catch (err) {
      const errorMessage = err.message || 'Failed to login';
      setError(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setLoading(false);
    }
  }, []);

  const verifyTwoFactor = useCallback(async (userId, token) => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await apiService.post('/auth/verify-2fa', { userId, token });
      
      if (response?.success && response?.data) {
        if (response.data.token) {
          await AsyncStorage.setItem('auth_token', response.data.token);
        }
        if (response.data.refreshToken) {
          await AsyncStorage.setItem('refresh_token', response.data.refreshToken);
        }
        if (response.data.user) {
          await AsyncStorage.setItem('user_data', JSON.stringify(response.data.user));
          setUser(response.data.user);
        }
        
        setIsAuthenticated(true);
        return { success: true };
      }
      
      throw new Error(response?.message || '2FA verification failed');
    } catch (err) {
      const errorMessage = err.message || '2FA verification failed';
      setError(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setLoading(false);
    }
  }, []);

  const register = useCallback(async (userData) => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await apiService.post('/auth/register', userData);
      
      if (response?.success && response?.data) {
        if (response.data.token) {
          await AsyncStorage.setItem('auth_token', response.data.token);
        }
        if (response.data.refreshToken) {
          await AsyncStorage.setItem('refresh_token', response.data.refreshToken);
        }
        if (response.data.user) {
          await AsyncStorage.setItem('user_data', JSON.stringify(response.data.user));
          setUser(response.data.user);
        }
        
        setIsAuthenticated(true);
        return { success: true, data: response.data };
      }
      
      throw new Error(response?.message || 'Registration failed');
    } catch (err) {
      const errorMessage = err.message || 'Failed to register';
      setError(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setLoading(false);
    }
  }, []);

  const logout = useCallback(async () => {
    try {
      setLoading(true);
      // Try to call logout endpoint, but don't wait for it
      try {
        await apiService.post('/auth/logout');
      } catch (err) {
        // Ignore logout endpoint errors
        console.log('Logout endpoint error:', err.message);
      }
    } catch (err) {
      console.error('Logout error:', err);
    } finally {
      // Always clear local data
      await clearTokens();
      await AsyncStorage.removeItem('user_data');
      setUser(null);
      setIsAuthenticated(false);
      setLoading(false);
    }
  }, []);

  const updateProfile = useCallback(async (profileData) => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await apiService.put('/auth/profile', profileData);
      
      if (response?.success && response?.data?.user) {
        setUser(response.data.user);
        await AsyncStorage.setItem('user_data', JSON.stringify(response.data.user));
        return { success: true };
      }
      
      throw new Error(response?.message || 'Failed to update profile');
    } catch (err) {
      const errorMessage = err.message || 'Failed to update profile';
      setError(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setLoading(false);
    }
  }, []);

  const changePassword = useCallback(async (currentPassword, newPassword) => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await apiService.post('/auth/change-password', {
        currentPassword,
        newPassword,
      });
      
      if (response?.success) {
        return { success: true };
      }
      
      throw new Error(response?.message || 'Failed to change password');
    } catch (err) {
      const errorMessage = err.message || 'Failed to change password';
      setError(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setLoading(false);
    }
  }, []);

  const forgotPassword = useCallback(async (email) => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await apiService.post('/auth/forgot-password', { email });
      
      if (response?.success) {
        return { success: true };
      }
      
      throw new Error(response?.message || 'Failed to send reset email');
    } catch (err) {
      const errorMessage = err.message || 'Failed to send reset email';
      setError(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setLoading(false);
    }
  }, []);

  const resetPassword = useCallback(async (token, password) => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await apiService.post('/auth/reset-password', { token, password });
      
      if (response?.success) {
        return { success: true };
      }
      
      throw new Error(response?.message || 'Failed to reset password');
    } catch (err) {
      const errorMessage = err.message || 'Failed to reset password';
      setError(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setLoading(false);
    }
  }, []);

  const verifyEmail = useCallback(async (token) => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await apiService.post('/auth/verify-email', { token });
      
      if (response?.success) {
        return { success: true };
      }
      
      throw new Error(response?.message || 'Failed to verify email');
    } catch (err) {
      const errorMessage = err.message || 'Failed to verify email';
      setError(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setLoading(false);
    }
  }, []);

  const resendVerification = useCallback(async (email) => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await apiService.post('/auth/resend-verification', { email });
      
      if (response?.success) {
        return { success: true };
      }
      
      throw new Error(response?.message || 'Failed to resend verification');
    } catch (err) {
      const errorMessage = err.message || 'Failed to resend verification';
      setError(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setLoading(false);
    }
  }, []);

  const enable2FA = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await apiService.post('/auth/enable-2fa');
      
      if (response?.success && response?.data) {
        return response.data;
      }
      
      throw new Error(response?.message || 'Failed to enable 2FA');
    } catch (err) {
      const errorMessage = err.message || 'Failed to enable 2FA';
      setError(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setLoading(false);
    }
  }, []);

  const verify2FASetup = useCallback(async (token) => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await apiService.post('/auth/verify-2fa-setup', { token });
      
      if (response?.success && response?.data) {
        return { success: true, backupCodes: response.data.backupCodes };
      }
      
      throw new Error(response?.message || 'Failed to verify 2FA');
    } catch (err) {
      const errorMessage = err.message || 'Failed to verify 2FA';
      setError(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setLoading(false);
    }
  }, []);

  const disable2FA = useCallback(async (token) => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await apiService.post('/auth/disable-2fa', { token });
      
      if (response?.success) {
        return { success: true };
      }
      
      throw new Error(response?.message || 'Failed to disable 2FA');
    } catch (err) {
      const errorMessage = err.message || 'Failed to disable 2FA';
      setError(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setLoading(false);
    }
  }, []);

  const get2FAStatus = useCallback(async () => {
    try {
      const response = await apiService.get('/auth/2fa-status');
      
      if (response?.success && response?.data) {
        return response.data;
      }
      
      return null;
    } catch (err) {
      console.error('Failed to get 2FA status:', err);
      return null;
    }
  }, []);

  const generateApiKey = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await apiService.post('/auth/generate-api-key');
      
      if (response?.success && response?.data) {
        return response.data;
      }
      
      throw new Error(response?.message || 'Failed to generate API key');
    } catch (err) {
      const errorMessage = err.message || 'Failed to generate API key';
      setError(errorMessage);
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  const revokeApiKey = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await apiService.delete('/auth/revoke-api-key');
      
      if (response?.success) {
        return { success: true };
      }
      
      throw new Error(response?.message || 'Failed to revoke API key');
    } catch (err) {
      const errorMessage = err.message || 'Failed to revoke API key';
      setError(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setLoading(false);
    }
  }, []);

  const loginWithGoogle = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await apiService.post('/auth/google');
      
      if (response?.success && response?.data) {
        await initAuth();
        return { success: true };
      }
      
      throw new Error(response?.message || 'Failed to login with Google');
    } catch (err) {
      const errorMessage = err.message || 'Failed to login with Google';
      setError(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setLoading(false);
    }
  }, []);

  const loginWithFacebook = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await apiService.post('/auth/facebook');
      
      if (response?.success && response?.data) {
        await initAuth();
        return { success: true };
      }
      
      throw new Error(response?.message || 'Failed to login with Facebook');
    } catch (err) {
      const errorMessage = err.message || 'Failed to login with Facebook';
      setError(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setLoading(false);
    }
  }, []);

  const handleOAuthCallback = useCallback(async (url) => {
    try {
      setLoading(true);
      
      const response = await apiService.post('/auth/oauth-callback', { url });
      
      if (response?.success && response?.data) {
        await initAuth();
        return true;
      }
      
      return false;
    } catch (err) {
      console.error('OAuth callback error:', err);
      return false;
    } finally {
      setLoading(false);
    }
  }, []);

  const value = {
    user,
    loading,
    error,
    isAuthenticated,
    login,
    verifyTwoFactor,
    register,
    logout,
    updateProfile,
    changePassword,
    forgotPassword,
    resetPassword,
    verifyEmail,
    resendVerification,
    enable2FA,
    verify2FASetup,
    disable2FA,
    get2FAStatus,
    generateApiKey,
    revokeApiKey,
    loginWithGoogle,
    loginWithFacebook,
    handleOAuthCallback,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};