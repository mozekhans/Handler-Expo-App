import { Platform } from 'react-native';

/**
 * Helper to ensure Reanimated is properly initialized
 * Call this at the very beginning of your app
 */
export const setupReanimated = () => {
  if (Platform.OS === 'android') {
    // Force Reanimated to initialize on Android
    try {
      // This will trigger Reanimated initialization
      const { default: Reanimated } = require('react-native-reanimated');
      if (Reanimated && Reanimated.default) {
        console.log('Reanimated initialized successfully');
      }
    } catch (error) {
      console.warn('Reanimated initialization warning:', error);
    }
  }
};

/**
 * Check if Reanimated is properly loaded
 */
export const isReanimatedReady = () => {
  try {
    const { default: Reanimated } = require('react-native-reanimated');
    return !!Reanimated && !!Reanimated.default;
  } catch {
    return false;
  }
};