// src/services/authService.js
import api, { setAuthToken, setRefreshToken, clearTokens } from './apiService';
import * as WebBrowser from 'expo-web-browser';
import * as AuthSession from 'expo-auth-session';
import { Platform } from 'react-native';

WebBrowser.maybeCompleteAuthSession();

class AuthService {
  async login(email, password, twoFactorCode = null) {
    const response = await api.post('/auth/login', {
      email,
      password,
      twoFactorCode,
    });
    
    if (response.data.token) {
      await setAuthToken(response.data.token);
      if (response.data.refreshToken) {
        await setRefreshToken(response.data.refreshToken);
      }
    }
    
    return response.data;
  }

  async register(userData) {
    const response = await api.post('/auth/register', userData);
    
    if (response.data.token) {
      await setAuthToken(response.data.token);
      if (response.data.refreshToken) {
        await setRefreshToken(response.data.refreshToken);
      }
    }
    
    return response.data;
  }

  async logout() {
    try {
      await api.post('/auth/logout');
    } finally {
      await clearTokens();
    }
  }

  async getCurrentUser() {
    const response = await api.get('/auth/me');
    return response.data;
  }

  async updateProfile(profileData) {
    const response = await api.put('/auth/profile', profileData);
    return response.data;
  }

  async changePassword(currentPassword, newPassword) {
    const response = await api.post('/auth/change-password', {
      currentPassword,
      newPassword,
    });
    return response.data;
  }

  async forgotPassword(email) {
    const response = await api.post('/auth/forgot-password', { email });
    return response.data;
  }

  async resetPassword(token, password) {
    const response = await api.post(`/auth/reset-password/${token}`, { password });
    return response.data;
  }

  async verifyEmail(token) {
    const response = await api.get(`/auth/verify-email/${token}`);
    return response.data;
  }

  async resendVerification(email) {
    const response = await api.post('/auth/resend-verification', { email });
    return response.data;
  }

  async enable2FA() {
    const response = await api.post('/auth/enable-2fa');
    return response.data;
  }

  async verify2FASetup(token) {
    const response = await api.post('/auth/verify-2fa-setup', { token });
    return response.data;
  }

  async disable2FA(token) {
    const response = await api.post('/auth/disable-2fa', { token });
    return response.data;
  }

  async get2FAStatus() {
    const response = await api.get('/auth/2fa-status');
    return response.data;
  }

  async generateApiKey() {
    const response = await api.post('/auth/generate-api-key');
    return response.data;
  }

  async revokeApiKey() {
    const response = await api.post('/auth/revoke-api-key');
    return response.data;
  }

  async verifyTwoFactor(userId, token) {
    const response = await api.post('/auth/verify-2fa', { userId, token });
    
    if (response.data.token) {
      await setAuthToken(response.data.token);
      if (response.data.refreshToken) {
        await setRefreshToken(response.data.refreshToken);
      }
    }
    
    return response.data;
  }

  async socialAuth(provider) {
    // Configure OAuth redirect URL
    const redirectUri = AuthSession.makeRedirectUri({
      scheme: 'yourapp',
      path: 'auth/callback',
    });

    const authUrl = `${api.defaults.baseURL}/auth/${provider}?redirect_uri=${encodeURIComponent(redirectUri)}`;
    
    const result = await WebBrowser.openAuthSessionAsync(authUrl, redirectUri);
    
    if (result.type === 'success') {
      const url = result.url;
      // Parse token from URL
      const params = new URLSearchParams(url.split('?')[1]);
      const token = params.get('token');
      const refreshToken = params.get('refreshToken');
      
      if (token) {
        await setAuthToken(token);
        if (refreshToken) {
          await setRefreshToken(refreshToken);
        }
        return { success: true };
      }
    }
    
    return { success: false };
  }

  async handleOAuthCallback(url) {
    const params = new URLSearchParams(url.split('?')[1]);
    const token = params.get('token');
    const refreshToken = params.get('refreshToken');
    
    if (token) {
      await setAuthToken(token);
      if (refreshToken) {
        await setRefreshToken(refreshToken);
      }
      return true;
    }
    
    return false;
  }
}

export default new AuthService();