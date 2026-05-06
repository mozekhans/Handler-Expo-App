// src/screens/auth/SocialLoginScreen.js
import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ActivityIndicator,
} from 'react-native';
import { useAuth } from '../../hooks/useAuth';

const SocialLoginScreen = ({ navigation, route }) => {
  const { handleOAuthCallback } = useAuth();
  const [error, setError] = useState(null);

  useEffect(() => {
    const processCallback = async () => {
      const url = route.params?.url;
      const errorParam = route.params?.error;

      if (errorParam) {
        setError('Authentication failed. Please try again.');
        setTimeout(() => navigation.navigate('Login'), 3000);
        return;
      }

      try {
        const success = await handleOAuthCallback(url);
        
        if (success) {
          navigation.navigate('Dashboard');
        } else {
          setError('Failed to complete authentication');
          setTimeout(() => navigation.navigate('Login'), 3000);
        }
      } catch (err) {
        setError('An error occurred during authentication');
        setTimeout(() => navigation.navigate('Login'), 3000);
      }
    };

    processCallback();
  }, [route.params]);

  return (
    <View style={styles.container}>
      <View style={styles.card}>
        {error ? (
          <>
            <View style={styles.errorContainer}>
              <Text style={styles.errorText}>{error}</Text>
            </View>
            <Text style={styles.redirectText}>Redirecting to login...</Text>
          </>
        ) : (
          <>
            <ActivityIndicator size="large" color="#1976d2" />
            <Text style={styles.title}>Completing authentication...</Text>
            <Text style={styles.subtitle}>
              Please wait while we log you in.
            </Text>
          </>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 32,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    width: '100%',
  },
  title: {
    fontSize: 20,
    fontWeight: '600',
    marginTop: 16,
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 14,
    color: '#666',
  },
  errorContainer: {
    backgroundColor: '#ffebee',
    padding: 16,
    borderRadius: 8,
    marginBottom: 16,
    width: '100%',
  },
  errorText: {
    color: '#f44336',
    textAlign: 'center',
  },
  redirectText: {
    fontSize: 14,
    color: '#666',
  },
});

export default SocialLoginScreen;