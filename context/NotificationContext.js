// context/NotificationProvider.js
import React, { createContext, useState, useEffect, useCallback, useRef } from 'react';
import { AppState } from 'react-native';
import { useAuth } from '../hooks/useAuth';
import pushNotificationService from '../services/pushNotificationService';
import notificationService from '../services/notificationService';
import { isPushNotificationsAvailable, isExpoGo } from '../utils/notificationHelpers';
import { eventEmitter, EVENTS } from '../utils/eventEmitter';

export const NotificationContext = createContext({
  notifications: [],
  unreadCount: 0,
  permission: false,
  isPushEnabled: false,
  isLoading: true,
  loadNotifications: async () => {},
  markAsRead: async () => {},
  markAllAsRead: async () => {},
  deleteNotification: async () => {},
  refresh: async () => {},
});

export const NotificationProvider = ({ children }) => {
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [permission, setPermission] = useState(false);
  const [isPushEnabled, setIsPushEnabled] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  
  const { isAuthenticated } = useAuth();
  const appState = useRef(AppState.currentState);
  const isMounted = useRef(true);

  // Initialize push notifications (only once)
  useEffect(() => {
    if (!isAuthenticated) {
      setIsLoading(false);
      return;
    }

    const init = async () => {
      setIsLoading(true);
      
      try {
        // Initialize push service if available
        if (isPushNotificationsAvailable()) {
          const initialized = await pushNotificationService.initialize();
          setIsPushEnabled(initialized);
          setPermission(initialized);
        } else {
          console.log(`[Notifications] Push ${isExpoGo ? 'disabled in Expo Go' : 'unavailable'}`);
          setIsPushEnabled(false);
        }

        // Load initial data
        await loadNotificationsData();
      } catch (error) {
        console.error('[Notifications] Init error:', error);
      } finally {
        if (isMounted.current) setIsLoading(false);
      }
    };

    init();

    return () => {
      isMounted.current = false;
      if (pushNotificationService.cleanup) {
        pushNotificationService.cleanup();
      }
    };
  }, [isAuthenticated]);

  // Listen for app state changes (refresh when foregrounded)
  useEffect(() => {
    if (!isAuthenticated) return;

    const subscription = AppState.addEventListener('change', nextAppState => {
      if (appState.current.match(/inactive|background/) && nextAppState === 'active') {
        // App came to foreground - refresh notifications
        loadNotificationsData();
      }
      appState.current = nextAppState;
    });

    return () => subscription.remove();
  }, [isAuthenticated]);

  // Listen for push notification events
  useEffect(() => {
    const handleNewNotification = (data) => {
      loadNotificationsData(); // Refresh list
    };

    const handleNotificationPress = (data) => {
      // Handle navigation or other actions
      console.log('[NotificationContext] Pressed:', data);
    };

    eventEmitter.on(EVENTS.NOTIFICATION_RECEIVED, handleNewNotification);
    eventEmitter.on(EVENTS.NOTIFICATION_PRESSED, handleNotificationPress);

    return () => {
      eventEmitter.off(EVENTS.NOTIFICATION_RECEIVED, handleNewNotification);
      eventEmitter.off(EVENTS.NOTIFICATION_PRESSED, handleNotificationPress);
    };
  }, []);

  // FIX: Load notifications from API with better error handling
  const loadNotificationsData = useCallback(async () => {
    if (!isAuthenticated) return;

    try {
      const response = await notificationService.getNotifications({ limit: 50 });
      
      if (!isMounted.current) return;

      // FIX: Handle different response structures safely
      let notificationsArray = [];
      let unreadCountValue = 0;

      if (response && typeof response === 'object') {
        // Check if response has notifications property
        if (response.notifications && Array.isArray(response.notifications)) {
          notificationsArray = response.notifications;
          unreadCountValue = response.unreadCount || 
            response.notifications.filter(n => !n.read).length;
        } 
        // Check if response itself is an array
        else if (Array.isArray(response)) {
          notificationsArray = response;
          unreadCountValue = response.filter(n => !n.read).length;
        }
        // Fallback to empty array
        else {
          notificationsArray = [];
          unreadCountValue = 0;
        }
      } else {
        notificationsArray = [];
        unreadCountValue = 0;
      }

      setNotifications(notificationsArray);
      setUnreadCount(unreadCountValue);
    } catch (error) {
      console.error('[Notifications] Load failed:', error);
      if (isMounted.current) {
        setNotifications([]);
        setUnreadCount(0);
      }
    }
  }, [isAuthenticated]);

  // Mark single as read
  const markAsRead = useCallback(async (notificationId) => {
    try {
      await notificationService.markAsRead(notificationId);
      
      setNotifications(prev => 
        prev.map(n => n.id === notificationId ? { ...n, read: true } : n)
      );
      setUnreadCount(prev => Math.max(0, prev - 1));
      
      // Update badge
      if (isPushEnabled && pushNotificationService.setBadgeCount) {
        await pushNotificationService.setBadgeCount(Math.max(0, unreadCount - 1));
      }
    } catch (error) {
      console.error('[Notifications] Mark read failed:', error);
    }
  }, [unreadCount, isPushEnabled]);

  // Mark all as read
  const markAllAsRead = useCallback(async () => {
    try {
      await notificationService.markAllAsRead();
      setNotifications(prev => prev.map(n => ({ ...n, read: true })));
      setUnreadCount(0);
      
      if (isPushEnabled && pushNotificationService.setBadgeCount) {
        await pushNotificationService.setBadgeCount(0);
      }
    } catch (error) {
      console.error('[Notifications] Mark all failed:', error);
    }
  }, [isPushEnabled]);

  // Delete notification
  const deleteNotification = useCallback(async (notificationId) => {
    try {
      const wasUnread = notifications.find(n => n.id === notificationId && !n.read);
      
      await notificationService.deleteNotification(notificationId);
      setNotifications(prev => prev.filter(n => n.id !== notificationId));
      
      if (wasUnread) {
        setUnreadCount(prev => Math.max(0, prev - 1));
      }
    } catch (error) {
      console.error('[Notifications] Delete failed:', error);
    }
  }, [notifications]);

  // Manual refresh
  const refresh = useCallback(async () => {
    setIsLoading(true);
    await loadNotificationsData();
    setIsLoading(false);
  }, [loadNotificationsData]);

  const value = {
    notifications,
    unreadCount,
    permission,
    isPushEnabled,
    isLoading,
    loadNotifications: loadNotificationsData,
    markAsRead,
    markAllAsRead,
    deleteNotification,
    refresh,
  };

  return (
    <NotificationContext.Provider value={value}>
      {children}
    </NotificationContext.Provider>
  );
};