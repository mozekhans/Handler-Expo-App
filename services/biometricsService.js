import * as LocalAuthentication from 'expo-local-authentication';
import * as SecureStore from 'expo-secure-store';
import { Platform, Alert } from 'react-native';

class BiometricService {
  constructor() {
    this.isAvailable = false;
    this.biometryType = null;
    this.checkAvailability();
  }

  async checkAvailability() {
    try {
      const hasHardware = await LocalAuthentication.hasHardwareAsync();
      const isEnrolled = await LocalAuthentication.isEnrolledAsync();
      const supportedTypes = await LocalAuthentication.supportedAuthenticationTypesAsync();
      
      this.isAvailable = hasHardware && isEnrolled;
      
      if (supportedTypes.includes(LocalAuthentication.AuthenticationType.FACIAL_RECOGNITION)) {
        this.biometryType = 'Face ID';
      } else if (supportedTypes.includes(LocalAuthentication.AuthenticationType.FINGERPRINT)) {
        this.biometryType = 'Touch ID';
      } else if (supportedTypes.includes(LocalAuthentication.AuthenticationType.IRIS)) {
        this.biometryType = 'Iris';
      } else {
        this.biometryType = 'Biometrics';
      }
      
      return { available: this.isAvailable, biometryType: this.biometryType };
    } catch (error) {
      console.error('Biometric availability check error:', error);
      return { available: false, biometryType: null };
    }
  }

  async isBiometricEnabled() {
    try {
      const enabled = await SecureStore.getItemAsync('biometric_enabled');
      return enabled === 'true';
    } catch {
      return false;
    }
  }

  async enableBiometric(userId, password) {
    if (!this.isAvailable) {
      Alert.alert('Not Available', 'Biometric authentication is not available on this device');
      return false;
    }

    try {
      // Store credentials securely
      await SecureStore.setItemAsync('biometric_user_id', userId);
      await SecureStore.setItemAsync('biometric_password', password);
      await SecureStore.setItemAsync('biometric_enabled', 'true');
      
      return true;
    } catch (error) {
      console.error('Enable biometric error:', error);
      Alert.alert('Error', 'Failed to enable biometric authentication');
      return false;
    }
  }

  async disableBiometric() {
    try {
      await SecureStore.deleteItemAsync('biometric_user_id');
      await SecureStore.deleteItemAsync('biometric_password');
      await SecureStore.deleteItemAsync('biometric_enabled');
      return true;
    } catch (error) {
      console.error('Disable biometric error:', error);
      return false;
    }
  }

  async authenticate(options = {}) {
    if (!this.isAvailable) {
      Alert.alert('Not Available', 'Biometric authentication is not available on this device');
      return { success: false };
    }

    try {
      const result = await LocalAuthentication.authenticateAsync({
        promptMessage: options.promptMessage || 'Authenticate to login',
        cancelLabel: options.cancelLabel || 'Cancel',
        disableDeviceFallback: options.disableDeviceFallback || false,
        fallbackLabel: options.fallbackLabel || 'Use passcode',
      });

      if (result.success) {
        // Get stored credentials
        const userId = await SecureStore.getItemAsync('biometric_user_id');
        const password = await SecureStore.getItemAsync('biometric_password');
        
        if (userId && password) {
          return { success: true, userId, password };
        }
        return { success: false, error: 'No stored credentials found' };
      }
      
      return { success: false, error: result.error };
    } catch (error) {
      console.error('Biometric authentication error:', error);
      return { success: false, error: error.message };
    }
  }

  async getBiometricType() {
    if (!this.isAvailable) return null;
    return this.biometryType;
  }

  async getSupportedTypes() {
    try {
      return await LocalAuthentication.supportedAuthenticationTypesAsync();
    } catch (error) {
      console.error('Error getting supported types:', error);
      return [];
    }
  }

  async hasHardware() {
    try {
      return await LocalAuthentication.hasHardwareAsync();
    } catch {
      return false;
    }
  }

  async isEnrolled() {
    try {
      return await LocalAuthentication.isEnrolledAsync();
    } catch {
      return false;
    }
  }
}

export default new BiometricService();