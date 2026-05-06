import { EventEmitter as NativeEventEmitter, NativeModules } from 'react-native';

class EventManager {
  constructor() {
    // Check if NativeEventEmitter is available
    if (NativeModules && NativeModules.RCTEventEmitter) {
      this.emitter = new NativeEventEmitter(NativeModules.RCTEventEmitter);
    } else {
      // Fallback for environments where NativeEventEmitter isn't available
      this.emitter = null;
      this.listeners = new Map();
      this.callbacks = new Map();
    }
    this.listeners = new Map();
  }

  /**
   * Emit an event with data
   * @param {string} event - Event name
   * @param {*} data - Event data
   */
  emit(event, data) {
    if (this.emitter) {
      this.emitter.emit(event, data);
    } else {
      // Fallback for non-native environments
      const callbacks = this.callbacks.get(event) || [];
      callbacks.forEach(callback => callback(data));
    }
  }

  /**
   * Subscribe to an event
   * @param {string} event - Event name
   * @param {Function} callback - Event handler
   * @returns {Function} Unsubscribe function
   */
  on(event, callback) {
    if (!this.listeners.has(event)) {
      this.listeners.set(event, new Set());
    }
    this.listeners.get(event).add(callback);
    
    if (this.emitter) {
      this.emitter.addListener(event, callback);
    } else {
      if (!this.callbacks.has(event)) {
        this.callbacks.set(event, []);
      }
      this.callbacks.get(event).push(callback);
    }
    
    // Return unsubscribe function
    return () => this.off(event, callback);
  }

  /**
   * Subscribe to an event once
   * @param {string} event - Event name
   * @param {Function} callback - Event handler
   * @returns {Function} Unsubscribe function
   */
  once(event, callback) {
    const onceCallback = (data) => {
      this.off(event, onceCallback);
      callback(data);
    };
    return this.on(event, onceCallback);
  }

  /**
   * Unsubscribe from an event
   * @param {string} event - Event name
   * @param {Function} callback - Event handler to remove
   */
  off(event, callback) {
    if (this.listeners.has(event)) {
      this.listeners.get(event).delete(callback);
      if (this.listeners.get(event).size === 0) {
        this.listeners.delete(event);
      }
    }
    
    if (this.emitter) {
      this.emitter.removeListener(event, callback);
    } else if (this.callbacks.has(event)) {
      const callbacks = this.callbacks.get(event);
      const index = callbacks.indexOf(callback);
      if (index > -1) {
        callbacks.splice(index, 1);
      }
      if (callbacks.length === 0) {
        this.callbacks.delete(event);
      }
    }
  }

  /**
   * Remove all listeners for an event
   * @param {string} event - Event name
   */
  removeAllListeners(event) {
    if (event) {
      this.listeners.delete(event);
      if (this.emitter) {
        this.emitter.removeAllListeners(event);
      } else {
        this.callbacks.delete(event);
      }
    } else {
      this.listeners.clear();
      if (this.emitter) {
        // Cannot remove all listeners from NativeEventEmitter without knowing them
        this.listeners.forEach((_, eventName) => {
          this.emitter.removeAllListeners(eventName);
        });
      } else {
        this.callbacks.clear();
      }
    }
  }

  /**
   * Get all registered event names
   * @returns {Array} List of event names
   */
  getEventNames() {
    return Array.from(this.listeners.keys());
  }

  /**
   * Get listener count for an event
   * @param {string} event - Event name
   * @returns {number} Number of listeners
   */
  listenerCount(event) {
    return this.listeners.has(event) ? this.listeners.get(event).size : 0;
  }
}

// Create singleton instance
export const eventEmitter = new EventManager();

// Predefined event types
export const EVENTS = {
  // App lifecycle
  APP_START: 'app:start',
  APP_BACKGROUND: 'app:background',
  APP_FOREGROUND: 'app:foreground',
  APP_TERMINATE: 'app:terminate',
  
  // Authentication
  LOGIN: 'auth:login',
  LOGOUT: 'auth:logout',
  TOKEN_REFRESHED: 'auth:token-refreshed',
  SESSION_EXPIRED: 'auth:session-expired',
  
  // User
  USER_UPDATED: 'user:updated',
  USER_PROFILE_CHANGED: 'user:profile-changed',
  
  // Business
  BUSINESS_SWITCHED: 'business:switched',
  BUSINESS_CREATED: 'business:created',
  BUSINESS_UPDATED: 'business:updated',
  BUSINESS_DELETED: 'business:deleted',
  
  // Content
  CONTENT_CREATED: 'content:created',
  CONTENT_UPDATED: 'content:updated',
  CONTENT_DELETED: 'content:deleted',
  CONTENT_PUBLISHED: 'content:published',
  CONTENT_SCHEDULED: 'content:scheduled',
  
  // Engagement
  NEW_MESSAGE: 'engagement:new-message',
  NEW_COMMENT: 'engagement:new-comment',
  NEW_MENTION: 'engagement:new-mention',
  NEW_LIKE: 'engagement:new-like',
  MESSAGE_READ: 'engagement:message-read',
  
  // Campaigns
  CAMPAIGN_STARTED: 'campaign:started',
  CAMPAIGN_PAUSED: 'campaign:paused',
  CAMPAIGN_COMPLETED: 'campaign:completed',
  
  // Notifications
  NOTIFICATION_RECEIVED: 'notification:received',
  NOTIFICATION_PRESSED: 'notification:pressed',
  NOTIFICATION_COUNT_UPDATED: 'notification:count-updated',
  
  // Network
  NETWORK_CONNECTED: 'network:connected',
  NETWORK_DISCONNECTED: 'network:disconnected',
  
  // Offline
  OFFLINE_QUEUE_UPDATED: 'offline:queue-updated',
  OFFLINE_PROCESSING: 'offline:processing',
  OFFLINE_ACTION_SYNCED: 'offline:action-synced',
  OFFLINE_ACTION_FAILED: 'offline:action-failed',
  OFFLINE_QUEUE_PROCESSED: 'offline:queue-processed',
  OFFLINE_QUEUE_CLEARED: 'offline:queue-cleared',
  
  // Analytics
  ANALYTICS_UPDATED: 'analytics:updated',
  
  // Socket
  SOCKET_CONNECTED: 'socket:connected',
  SOCKET_DISCONNECTED: 'socket:disconnected',
  SOCKET_ERROR: 'socket:error',
  
  // Theme
  THEME_CHANGED: 'theme:changed',
};

export default eventEmitter;