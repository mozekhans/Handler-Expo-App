import { useState, useCallback } from 'react';
import * as WebBrowser from 'expo-web-browser';
import * as Linking from 'expo-linking';
import socialService from '../services/socialService';

export const useOAuth = (businessId) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [platform, setPlatform] = useState(null);

  const startOAuth = useCallback(async (platform) => {
    try {
      setLoading(true);
      setError(null);
      setPlatform(platform);

      const redirectUri = Linking.createURL('integrations/callback');
      console.log(`Starting OAuth for ${platform} with redirect: ${redirectUri}`);

      const response = await socialService.getAuthUrl(
        businessId,
        platform,
        redirectUri
      );

      if (!response?.authUrl) {
        throw new Error('Failed to get authorization URL');
      }

      const result = await WebBrowser.openAuthSessionAsync(
        response.authUrl,
        redirectUri
      );

      console.log('OAuth result:', result.type);

      if (result.type === 'cancel') {
        throw new Error('Authorization cancelled');
      }

      if (result.type === 'dismiss') {
        throw new Error('Authorization dismissed');
      }

      // Parse the callback URL
      const url = new URL(result.url);
      const code = url.searchParams.get('code');
      const state = url.searchParams.get('state');
      const oauthError = url.searchParams.get('error');

      if (oauthError) {
        throw new Error(oauthError);
      }

      if (!code) {
        throw new Error('No authorization code received');
      }

      // Exchange code for tokens
      const connectResult = await socialService.connectAccount(
        businessId,
        platform,
        code,
        redirectUri
      );

      return connectResult;
    } catch (err) {
      console.error('OAuth error:', err);
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
      setPlatform(null);
    }
  }, [businessId]);

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  return {
    loading,
    error,
    platform,
    startOAuth,
    clearError,
  };
};