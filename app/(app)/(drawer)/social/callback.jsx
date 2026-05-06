import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ActivityIndicator } from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import socialService from '../../../../services/socialService';
import { theme } from '../../../../styles/theme';

export default function OAuthCallbackScreen() {
  const params = useLocalSearchParams();
  const [status, setStatus] = useState('Processing...');
  const [error, setError] = useState(null);

  useEffect(() => {
    handleCallback();
  }, []);

  const handleCallback = async () => {
    try {
      const { code, state, platform, error: oauthError } = params;

      console.log('OAuth Callback params:', { code: !!code, state, platform, error: oauthError });

      if (oauthError) {
        throw new Error(oauthError);
      }

      if (!code) {
        throw new Error('No authorization code received');
      }

      if (!platform) {
        throw new Error('Platform not specified');
      }

      setStatus('Exchanging code for access token...');

      const businessId = 'current-business-id'; // Get from stored state or context

      const result = await socialService.connectAccount(
        businessId,
        platform,
        code,
        null
      );

      console.log('Connection result:', result);

      setStatus('Account connected successfully!');
      
      setTimeout(() => {
        router.replace('/social');
      }, 1500);
    } catch (err) {
      console.error('Callback error:', err);
      setError(err.message || 'Failed to connect account');
      setStatus('Connection failed');
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.content}>
        {!error ? (
          <ActivityIndicator size="large" color={theme.colors.primary} />
        ) : (
          <View style={styles.errorIcon}>
            <Text style={styles.errorIconText}>!</Text>
          </View>
        )}
        <Text style={styles.status}>{status}</Text>
        {error && <Text style={styles.error}>{error}</Text>}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
    justifyContent: 'center',
    alignItems: 'center',
  },
  content: {
    alignItems: 'center',
    padding: theme.spacing.xl,
  },
  status: {
    fontSize: 18,
    fontWeight: '600',
    color: theme.colors.text,
    marginTop: theme.spacing.lg,
    textAlign: 'center',
  },
  error: {
    fontSize: 14,
    color: theme.colors.error,
    marginTop: theme.spacing.md,
    textAlign: 'center',
    lineHeight: 20,
  },
  errorIcon: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: theme.colors.error + '20',
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorIconText: {
    fontSize: 30,
    fontWeight: '700',
    color: theme.colors.error,
  },
});