// src/screens/auth/VerifyEmailScreen.js
import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { useAuth } from '../../hooks/useAuth';

const VerifyEmailScreen = ({ navigation, route }) => {
  const { verifyEmail, resendVerification } = useAuth();
  const { token } = route.params || {};
  const email = route.params?.email;
  const [loading, setLoading] = useState(false);
  const [resending, setResending] = useState(false);
  const [status, setStatus] = useState('pending'); // pending, success, error

  useEffect(() => {
    if (token) {
      verifyEmailToken();
    }
  }, [token]);

  const verifyEmailToken = async () => {
    try {
      setLoading(true);
      const result = await verifyEmail(token);
      
      if (result.success) {
        setStatus('success');
      } else {
        setStatus('error');
      }
    } catch (error) {
      setStatus('error');
    } finally {
      setLoading(false);
    }
  };

  const handleResendVerification = async () => {
    if (!email) return;

    try {
      setResending(true);
      const result = await resendVerification(email);
      
      if (result.success) {
        setStatus('resent');
        Alert.alert('Success', 'Verification email has been resent. Please check your inbox.');
      } else {
        Alert.alert('Error', result.error || 'Failed to resend verification email');
      }
    } catch (error) {
      Alert.alert('Error', 'An error occurred while resending verification');
    } finally {
      setResending(false);
    }
  };

  if (loading) {
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator size="large" color="#1976d2" />
        <Text style={styles.loadingText}>Verifying your email...</Text>
      </View>
    );
  }

  if (status === 'success') {
    return (
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <View style={styles.formContainer}>
          <Text style={styles.successIcon}>✓</Text>
          <Text style={styles.successTitle}>Email Verified!</Text>
          <Text style={styles.successText}>
            Your email has been verified successfully!
          </Text>
          <Text style={styles.helpText}>
            You can now access all features of your account.
          </Text>
          <TouchableOpacity
            style={styles.button}
            onPress={() => navigation.navigate('Login')}
          >
            <Text style={styles.buttonText}>Go to Login</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    );
  }

  if (status === 'error') {
    return (
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <View style={styles.formContainer}>
          <Text style={styles.errorIcon}>✗</Text>
          <Text style={styles.errorTitle}>Verification Failed</Text>
          <Text style={styles.errorText}>
            The verification link is invalid or has expired.
          </Text>
          {email && (
            <TouchableOpacity
              style={styles.button}
              onPress={handleResendVerification}
              disabled={resending}
            >
              {resending ? (
                <ActivityIndicator color="#fff" />
              ) : (
                <Text style={styles.buttonText}>Resend Verification Email</Text>
              )}
            </TouchableOpacity>
          )}
          <TouchableOpacity onPress={() => navigation.navigate('Login')}>
            <Text style={styles.linkText}>Back to Login</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    );
  }

  return (
    <ScrollView contentContainerStyle={styles.scrollContainer}>
      <View style={styles.formContainer}>
        <Text style={styles.emailIcon}>📧</Text>
        <Text style={styles.title}>Verify Your Email</Text>
        <Text style={styles.subtitle}>
          We've sent a verification email to:
        </Text>
        <Text style={styles.emailText}>{email || 'your email address'}</Text>
        <Text style={styles.helpText}>
          Click the link in the email to verify your account. If you don't see the email, check your spam folder.
        </Text>
        {email && (
          <TouchableOpacity
            style={styles.outlineButton}
            onPress={handleResendVerification}
            disabled={resending}
          >
            {resending ? (
              <ActivityIndicator color="#1976d2" />
            ) : (
              <Text style={styles.outlineButtonText}>Resend Verification Email</Text>
            )}
          </TouchableOpacity>
        )}
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: '#666',
  },
  scrollContainer: {
    flexGrow: 1,
    justifyContent: 'center',
    padding: 20,
  },
  formContainer: {
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    alignItems: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
    marginBottom: 8,
  },
  emailText: {
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 16,
  },
  helpText: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
    marginBottom: 24,
  },
  button: {
    backgroundColor: '#1976d2',
    borderRadius: 8,
    padding: 14,
    alignItems: 'center',
    width: '100%',
  },
  outlineButton: {
    borderWidth: 1,
    borderColor: '#1976d2',
    borderRadius: 8,
    padding: 14,
    alignItems: 'center',
    width: '100%',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  outlineButtonText: {
    color: '#1976d2',
    fontSize: 16,
    fontWeight: '600',
  },
  linkText: {
    color: '#1976d2',
    fontSize: 14,
    marginTop: 16,
  },
  successIcon: {
    fontSize: 80,
    color: '#4caf50',
    marginBottom: 16,
  },
  successTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#4caf50',
    textAlign: 'center',
    marginBottom: 8,
  },
  successText: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 16,
  },
  errorIcon: {
    fontSize: 80,
    color: '#f44336',
    marginBottom: 16,
  },
  errorTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#f44336',
    textAlign: 'center',
    marginBottom: 8,
  },
  errorText: {
    fontSize: 14,
    color: '#f44336',
    textAlign: 'center',
    marginBottom: 24,
  },
  emailIcon: {
    fontSize: 80,
    marginBottom: 16,
  },
});

export default VerifyEmailScreen;