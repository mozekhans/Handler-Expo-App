// services/pushNotificationService.js
import { eventEmitter, EVENTS } from '../utils/eventEmitter';
import { 
  isPushNotificationsAvailable, 
  loadNotificationsModule,
  isExpoGo 
} from '../utils/notificationHelpers';
import { Platform } from 'react-native';

class PushNotificationService {
  constructor() {
    this.expoPushToken = null;
    this.notificationListener = null;
    this.responseListener = null;
    this.isConfigured = false;
    this.moduleCache = null;
  }

  // Safe initialization - call this explicitly
  async initialize() {
    // Skip entirely if not available
    if (!isPushNotificationsAvailable()) {
      console.log(`[Push] Skipped: ${isExpoGo ? 'Expo Go' : 'Simulator/Emulator'}`);
      return false;
    }

    // Prevent double initialization
    if (this.isConfigured) return true;

    try {
      const modules = await loadNotificationsModule();
      if (!modules) return false;

      const { Notifications, Device } = modules;
      this.moduleCache = modules;

      // Configure handler
      Notifications.setNotificationHandler({
        handleNotification: async () => ({
          shouldShowAlert: true,
          shouldPlaySound: true,
          shouldSetBadge: true,
        }),
      });

      // Register for push
      await this.registerForPushNotifications(Notifications, Device);
      
      // Setup listeners
      this.setupListeners(Notifications);
      
      this.isConfigured = true;
      return true;
    } catch (error) {
      console.error('[Push] Initialization failed:', error);
      return false;
    }
  }

  async registerForPushNotifications(Notifications, Device) {
    try {
      const { status: existingStatus } = await Notifications.getPermissionsAsync();
      let finalStatus = existingStatus;

      if (existingStatus !== 'granted') {
        const { status } = await Notifications.requestPermissionsAsync();
        finalStatus = status;
      }

      if (finalStatus !== 'granted') {
        console.log('[Push] Permission denied');
        return;
      }

      // Get Expo push token
      const tokenData = await Notifications.getExpoPushTokenAsync({
        projectId: Constants.expoConfig?.extra?.eas?.projectId,
      });
      
      this.expoPushToken = tokenData.data;
      console.log('[Push] Token acquired:', this.expoPushToken?.substring(0, 20) + '...');

      // Save to backend
      await this.saveTokenToBackend(this.expoPushToken);

      // Android channel setup
      if (Platform.OS === 'android') {
        await this.setupAndroidChannels(Notifications);
      }
    } catch (error) {
      console.error('[Push] Registration error:', error);
    }
  }

  async setupAndroidChannels(Notifications) {
    const channels = [
      { id: 'default', name: 'Default', importance: Notifications.AndroidImportance.MAX },
      { id: 'engagement', name: 'Engagement', importance: Notifications.AndroidImportance.HIGH },
      { id: 'alerts', name: 'Alerts', importance: Notifications.AndroidImportance.HIGH },
    ];

    for (const channel of channels) {
      await Notifications.setNotificationChannelAsync(channel.id, {
        name: channel.name,
        importance: channel.importance,
        vibrationPattern: [0, 250, 250, 250],
        lightColor: '#FF231F7C',
      });
    }
  }

  async saveTokenToBackend(token) {
    if (!token) return;
    
    try {
      // Dynamic import to prevent circular deps
      const { default: notificationService } = await import('./notificationService');
      await notificationService.registerDevice(token);
    } catch (error) {
      console.error('[Push] Failed to save token:', error);
    }
  }

  setupListeners(Notifications) {
    // Foreground notifications
    this.notificationListener = Notifications.addNotificationReceivedListener(
      (notification) => {
        console.log('[Push] Received:', notification.request.content.title);
        this.handleNotification(notification);
      }
    );

    // User tapped notification
    this.responseListener = Notifications.addNotificationResponseReceivedListener(
      (response) => {
        console.log('[Push] Tapped:', response.actionIdentifier);
        this.handleNotificationPress(response.notification.request.content.data);
      }
    );
  }

  handleNotification(notification) {
    const { title, body, data } = notification.request.content;
    eventEmitter.emit(EVENTS.NOTIFICATION_RECEIVED, { title, body, data, timestamp: Date.now() });
  }

  handleNotificationPress(data) {
    eventEmitter.emit(EVENTS.NOTIFICATION_PRESSED, data);
    
    // Navigation handled by listener in components
    console.log('[Push] Navigation data:', data);
  }

  // Public API: Schedule local notification
  async scheduleLocalNotification(title, body, data = {}, triggerDate = null) {
    if (!this.isConfigured || !this.moduleCache) {
      console.warn('[Push] Cannot schedule: not initialized');
      return null;
    }

    const { Notifications } = this.moduleCache;
    
    try {
      const id = await Notifications.scheduleNotificationAsync({
        content: { title, body, data },
        trigger: triggerDate ? { date: triggerDate } : null,
      });
      return id;
    } catch (error) {
      console.error('[Push] Schedule failed:', error);
      return null;
    }
  }

  // Public API: Cancel all scheduled
  async cancelAllScheduled() {
    if (!this.isConfigured || !this.moduleCache) return;
    
    const { Notifications } = this.moduleCache;
    await Notifications.cancelAllScheduledNotificationsAsync();
  }

  // Public API: Get badge count
  async getBadgeCount() {
    if (!this.isConfigured || !this.moduleCache) return 0;
    
    const { Notifications } = this.moduleCache;
    return await Notifications.getBadgeCountAsync();
  }

  // Public API: Set badge count
  async setBadgeCount(count) {
    if (!this.isConfigured || !this.moduleCache) return;
    
    const { Notifications } = this.moduleCache;
    await Notifications.setBadgeCountAsync(count);
  }

  // Cleanup
  cleanup() {
    if (this.notificationListener) {
      this.notificationListener.remove();
      this.notificationListener = null;
    }
    if (this.responseListener) {
      this.responseListener.remove();
      this.responseListener = null;
    }
    this.isConfigured = false;
    this.moduleCache = null;
  }

  // Getters
  getPushToken() { return this.expoPushToken; }
  isReady() { return this.isConfigured; }
}

// Export singleton
export default new PushNotificationService();