import { io } from 'socket.io-client';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Platform } from 'react-native';

const SOCKET_URL = process.env.SOCKET_URL || 'http://localhost:5000';

class SocketService {
  constructor() {
    this.socket = null;
    this.listeners = new Map();
    this.reconnectAttempts = 0;
    this.maxReconnectAttempts = 5;
  }

  async connect() {
    if (this.socket?.connected) return;

    const token = await AsyncStorage.getItem('token');

    this.socket = io(SOCKET_URL, {
      auth: { token },
      transports: ['websocket'],
      reconnection: true,
      reconnectionAttempts: this.maxReconnectAttempts,
      reconnectionDelay: 1000,
      reconnectionDelayMax: 5000,
      timeout: 10000,
      forceNew: true
    });

    this.socket.on('connect', () => {
      console.log('Socket connected');
      this.reconnectAttempts = 0;
      this.emit('user:online', { platform: Platform.OS });
    });

    this.socket.on('disconnect', (reason) => {
      console.log('Socket disconnected:', reason);
    });

    this.socket.on('error', (error) => {
      console.error('Socket error:', error);
    });

    this.socket.on('reconnect', (attemptNumber) => {
      console.log('Socket reconnected after', attemptNumber, 'attempts');
    });

    this.socket.on('reconnect_failed', () => {
      console.log('Socket reconnection failed');
    });

    // Reattach listeners on reconnect
    this.socket.on('reconnect', () => {
      this.listeners.forEach((callbacks, event) => {
        callbacks.forEach(callback => {
          this.socket.on(event, callback);
        });
      });
    });
  }

  disconnect() {
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
      this.listeners.clear();
    }
  }

  on(event, callback) {
    if (!this.listeners.has(event)) {
      this.listeners.set(event, new Set());
    }
    this.listeners.get(event).add(callback);
    
    if (this.socket) {
      this.socket.on(event, callback);
    }
  }

  off(event, callback) {
    if (this.listeners.has(event)) {
      this.listeners.get(event).delete(callback);
    }
    
    if (this.socket) {
      this.socket.off(event, callback);
    }
  }

  emit(event, data) {
    if (this.socket?.connected) {
      this.socket.emit(event, data);
    } else {
      console.warn('Socket not connected, cannot emit:', event);
    }
  }

  // Business-specific methods
  joinBusiness(businessId) {
    this.emit('join-business', businessId);
  }

  leaveBusiness(businessId) {
    this.emit('leave-business', businessId);
  }

  // Real-time engagement
  onNewEngagement(callback) {
    this.on('new-engagement', callback);
  }

  onNewComment(callback) {
    this.on('new-comment', callback);
  }

  onNewMessage(callback) {
    this.on('new-message', callback);
  }

  onNewMention(callback) {
    this.on('new-mention', callback);
  }

  // Typing indicators
  sendTyping(businessId, conversationId, isTyping) {
    this.emit('typing', { businessId, conversationId, isTyping });
  }

  onUserTyping(callback) {
    this.on('user-typing', callback);
  }

  // Read receipts
  markMessageRead(businessId, conversationId, messageId) {
    this.emit('read-message', { businessId, conversationId, messageId });
  }

  onMessageRead(callback) {
    this.on('message-read', callback);
  }

  // Content updates
  onContentPublished(callback) {
    this.on('content-published', callback);
  }

  onContentScheduled(callback) {
    this.on('content-scheduled', callback);
  }

  // Campaign updates
  onCampaignStarted(callback) {
    this.on('campaign-started', callback);
  }

  onCampaignCompleted(callback) {
    this.on('campaign-completed', callback);
  }

  // Analytics updates
  onAnalyticsUpdate(callback) {
    this.on('analytics-update', callback);
  }

  // Notifications
  onNotification(callback) {
    this.on('notification', callback);
  }

  // User presence
  onUserPresence(callback) {
    this.on('user-presence', callback);
  }

  // Connection status
  isConnected() {
    return this.socket?.connected || false;
  }

  getSocketId() {
    return this.socket?.id || null;
  }

  // Reconnection management
  setMaxReconnectAttempts(attempts) {
    this.maxReconnectAttempts = attempts;
  }

  manuallyReconnect() {
    if (!this.socket?.connected && this.reconnectAttempts < this.maxReconnectAttempts) {
      this.reconnectAttempts++;
      this.socket?.connect();
    }
  }

  // Remove listeners
  offNewEngagement(callback) {
    this.off('new-engagement', callback);
  }

  offNewComment(callback) {
    this.off('new-comment', callback);
  }

  offNewMessage(callback) {
    this.off('new-message', callback);
  }

  offNewMention(callback) {
    this.off('new-mention', callback);
  }

  offUserTyping(callback) {
    this.off('user-typing', callback);
  }

  offMessageRead(callback) {
    this.off('message-read', callback);
  }
}

export default new SocketService();