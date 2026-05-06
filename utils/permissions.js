import { Platform, Alert } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import * as Notifications from 'expo-notifications';
import * as LocalAuthentication from 'expo-local-authentication';
import * as Calendar from 'expo-calendar';
import * as Contacts from 'expo-contacts';

class PermissionManager {
  constructor() {
    this.permissions = {
      camera: false,
      mediaLibrary: false,
      notifications: false,
      biometrics: false,
      calendar: false,
      contacts: false,
    };
  }

  async requestCameraPermission() {
    try {
      const { status } = await ImagePicker.requestCameraPermissionsAsync();
      this.permissions.camera = status === 'granted';
      return this.permissions.camera;
    } catch (error) {
      console.error('Camera permission error:', error);
      return false;
    }
  }

  async checkCameraPermission() {
    try {
      const { status } = await ImagePicker.getCameraPermissionsAsync();
      this.permissions.camera = status === 'granted';
      return this.permissions.camera;
    } catch (error) {
      console.error('Check camera permission error:', error);
      return false;
    }
  }

  async requestMediaLibraryPermission() {
    try {
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      this.permissions.mediaLibrary = status === 'granted';
      return this.permissions.mediaLibrary;
    } catch (error) {
      console.error('Media library permission error:', error);
      return false;
    }
  }

  async checkMediaLibraryPermission() {
    try {
      const { status } = await ImagePicker.getMediaLibraryPermissionsAsync();
      this.permissions.mediaLibrary = status === 'granted';
      return this.permissions.mediaLibrary;
    } catch (error) {
      console.error('Check media library error:', error);
      return false;
    }
  }

  async requestNotificationPermission() {
    try {
      const { status: existingStatus } = await Notifications.getPermissionsAsync();
      let finalStatus = existingStatus;
      
      if (existingStatus !== 'granted') {
        const { status } = await Notifications.requestPermissionsAsync();
        finalStatus = status;
      }
      
      this.permissions.notifications = finalStatus === 'granted';
      return this.permissions.notifications;
    } catch (error) {
      console.error('Notification permission error:', error);
      return false;
    }
  }

  async checkNotificationPermission() {
    try {
      const { status } = await Notifications.getPermissionsAsync();
      this.permissions.notifications = status === 'granted';
      return this.permissions.notifications;
    } catch (error) {
      console.error('Check notification error:', error);
      return false;
    }
  }

  async requestBiometricPermission() {
    try {
      const hasHardware = await LocalAuthentication.hasHardwareAsync();
      const isEnrolled = await LocalAuthentication.isEnrolledAsync();
      
      this.permissions.biometrics = hasHardware && isEnrolled;
      return this.permissions.biometrics;
    } catch (error) {
      console.error('Biometric permission error:', error);
      return false;
    }
  }

  async checkBiometricPermission() {
    try {
      const hasHardware = await LocalAuthentication.hasHardwareAsync();
      const isEnrolled = await LocalAuthentication.isEnrolledAsync();
      
      this.permissions.biometrics = hasHardware && isEnrolled;
      return this.permissions.biometrics;
    } catch (error) {
      console.error('Check biometric error:', error);
      return false;
    }
  }

  async requestCalendarPermission() {
    try {
      const { status } = await Calendar.requestCalendarPermissionsAsync();
      this.permissions.calendar = status === 'granted';
      return this.permissions.calendar;
    } catch (error) {
      console.error('Calendar permission error:', error);
      return false;
    }
  }

  async checkCalendarPermission() {
    try {
      const { status } = await Calendar.getCalendarPermissionsAsync();
      this.permissions.calendar = status === 'granted';
      return this.permissions.calendar;
    } catch (error) {
      console.error('Check calendar error:', error);
      return false;
    }
  }

  async requestContactsPermission() {
    try {
      const { status } = await Contacts.requestPermissionsAsync();
      this.permissions.contacts = status === 'granted';
      return this.permissions.contacts;
    } catch (error) {
      console.error('Contacts permission error:', error);
      return false;
    }
  }

  async checkContactsPermission() {
    try {
      const { status } = await Contacts.getPermissionsAsync();
      this.permissions.contacts = status === 'granted';
      return this.permissions.contacts;
    } catch (error) {
      console.error('Check contacts error:', error);
      return false;
    }
  }

  async requestAllPermissions() {
    const results = await Promise.all([
      this.requestCameraPermission(),
      this.requestMediaLibraryPermission(),
      this.requestNotificationPermission(),
      this.requestBiometricPermission(),
    ]);
    
    return {
      camera: results[0],
      mediaLibrary: results[1],
      notifications: results[2],
      biometrics: results[3],
    };
  }

  getPermissionStatus(permission) {
    return this.permissions[permission] || false;
  }

  getAllPermissions() {
    return { ...this.permissions };
  }
}

export default new PermissionManager();