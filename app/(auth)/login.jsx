// src/screens/auth/LoginScreen.js
import React, { useState } from 'react';
import { useRouter } from 'expo-router';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { useAuth } from '../../hooks/useAuth';
import { useForm } from '../../hooks/useForm';

const LoginScreen = ({ navigation }) => {
  const { login, loginWithGoogle, loginWithFacebook } = useAuth();
  const [showPassword, setShowPassword] = useState(false);
  const [requiresTwoFactor, setRequiresTwoFactor] = useState(false);
  const [userId, setUserId] = useState(null);
  const [twoFactorCode, setTwoFactorCode] = useState('');
  const router = useRouter();

  const { values, handleChange, handleSubmit, isSubmitting, setFieldValue } = useForm({
    initialValues: {
      email: '',
      password: '',
    },
    validate: (formValues) => {
      const errors = {};
      if (!formValues.email) {
        errors.email = 'Email is required';
      } else if (!/\S+@\S+\.\S+/.test(formValues.email)) {
        errors.email = 'Email is invalid';
      }
      if (!formValues.password) {
        errors.password = 'Password is required';
      }
      return errors;
    },
    onSubmit: async (formValues) => {
      const result = await login(formValues.email, formValues.password);
      
      if (result.requiresTwoFactor) {
        setRequiresTwoFactor(true);
        setUserId(result.userId);
      } else if (result.success) {
        // Navigate to dashboard is handled by AppNavigator
        router.replace('/dashboard');
      } else {
        Alert.alert('Login Failed', result.error || 'Failed to login');
      }
    },
  });

  const handleTwoFactorSubmit = async () => {
    // Handle 2FA verification
    Alert.alert('2FA Required', 'Please enter your 2FA code');
  };

  const handleSocialLogin = async (provider) => {
    let result;
    if (provider === 'google') {
      result = await loginWithGoogle();
    } else if (provider === 'facebook') {
      result = await loginWithFacebook();
    }
    
    if (!result?.success) {
      Alert.alert('Login Failed', result?.error || `Failed to login with ${provider}`);
    }
  };

  if (requiresTwoFactor) {
    return (
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.container}
      >
        <ScrollView contentContainerStyle={styles.scrollContainer}>
          <View style={styles.formContainer}>
            <Text style={styles.title}>Two-Factor Authentication</Text>
            <Text style={styles.subtitle}>
              Please enter the 6-digit code from your authenticator app
            </Text>

            <TextInput
              style={styles.input}
              placeholder="6-digit code"
              value={twoFactorCode}
              onChangeText={setTwoFactorCode}
              keyboardType="number-pad"
              maxLength={6}
            />

            <TouchableOpacity
              style={styles.button}
              onPress={handleTwoFactorSubmit}
              disabled={twoFactorCode.length !== 6}
            >
              <Text style={styles.buttonText}>Verify</Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => {
                setRequiresTwoFactor(false);
                setTwoFactorCode('');
              }}
            >
              <Text style={styles.linkText}>Back to Login</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    );
  }

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}
    >
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <View style={styles.formContainer}>
          <Text style={styles.title}>Welcome Back</Text>
          <Text style={styles.subtitle}>
            Sign in to continue to AI Social Media Manager
          </Text>

          <TextInput
            style={styles.input}
            placeholder="Email Address"
            value={values.email}
            onChangeText={(text) => handleChange('email', text)}
            keyboardType="email-address"
            autoCapitalize="none"
            autoCorrect={false}
          />

          <View style={styles.passwordContainer}>
            <TextInput
              style={[styles.input, styles.passwordInput]}
              placeholder="Password"
              value={values.password}
              onChangeText={(text) => handleChange('password', text)}
              secureTextEntry={!showPassword}
            />
            <TouchableOpacity
              style={styles.eyeButton}
              onPress={() => setShowPassword(!showPassword)}
            >
              <Text>{showPassword ? '👁️' : '👁️‍🗨️'}</Text>
            </TouchableOpacity>
          </View>

          <TouchableOpacity
            style={styles.button}
            onPress={handleSubmit}
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text style={styles.buttonText}>Sign In</Text>
            )}
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => router.push('/forgot-password')}
            style={styles.forgotPassword}
          >
            <Text style={styles.linkText}>Forgot password?</Text>
          </TouchableOpacity>

          <View style={styles.divider}>
            <View style={styles.dividerLine} />
            <Text style={styles.dividerText}>OR</Text>
            <View style={styles.dividerLine} />
          </View>

          <View style={styles.socialContainer}>
            <TouchableOpacity
              style={styles.socialButton}
              onPress={() => handleSocialLogin('google')}
            >
              <Text style={styles.socialButtonText}>G</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.socialButton}
              onPress={() => handleSocialLogin('facebook')}
            >
              <Text style={styles.socialButtonText}>f</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.footer}>
            <Text style={styles.footerText}>Don't have an account? </Text>
            <TouchableOpacity onPress={() => router.push('/register')}>
              <Text style={styles.footerLink}>Sign Up</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
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
    marginBottom: 24,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    marginBottom: 16,
    backgroundColor: '#fff',
  },
  passwordContainer: {
    position: 'relative',
  },
  passwordInput: {
    marginBottom: 0,
  },
  eyeButton: {
    position: 'absolute',
    right: 12,
    top: 12,
  },
  button: {
    backgroundColor: '#1976d2',
    borderRadius: 8,
    padding: 14,
    alignItems: 'center',
    marginTop: 8,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  forgotPassword: {
    alignItems: 'center',
    marginTop: 16,
  },
  linkText: {
    color: '#1976d2',
    fontSize: 14,
  },
  divider: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 24,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: '#ddd',
  },
  dividerText: {
    marginHorizontal: 16,
    color: '#666',
  },
  socialContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 16,
    marginBottom: 24,
  },
  socialButton: {
    width: 48,
    height: 48,
    borderRadius: 24,
    borderWidth: 1,
    borderColor: '#ddd',
    justifyContent: 'center',
    alignItems: 'center',
  },
  socialButtonText: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'center',
  },
  footerText: {
    color: '#666',
  },
  footerLink: {
    color: '#1976d2',
    fontWeight: '600',
  },
});

export default LoginScreen;