// utils/notificationHelpers.js
import Constants from 'expo-constants';
import { Platform } from 'react-native';

// Detect environment
export const isExpoGo = Constants.appOwnership === 'expo';
export const isDevelopmentBuild = !isExpoGo && __DEV__;
export const isProduction = !__DEV__;
export const isPhysicalDevice = Constants.platform?.ios?.model || Constants.platform?.android?.model;

// Check if push notifications are available
export const isPushNotificationsAvailable = () => {
  // Not available in Expo Go (SDK 53+)
  if (isExpoGo) return false;
  // Not available on simulators/emulators
  if (!isPhysicalDevice) return false;
  // Web doesn't support push
  if (Platform.OS === 'web') return false;
  
  return true;
};

// Safe module loader (prevents crashes)
export const loadNotificationsModule = async () => {
  if (!isPushNotificationsAvailable()) {
    return null;
  }
  
  try {
    const Notifications = await import('expo-notifications');
    const Device = await import('expo-device');
    return { Notifications, Device };
  } catch (error) {
    console.warn('Failed to load expo-notifications:', error);
    return null;
  }
};