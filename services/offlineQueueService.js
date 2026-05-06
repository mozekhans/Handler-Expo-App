import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Network from 'expo-network';
import api from './apiService';
import { eventEmitter, EVENTS } from '../utils/eventEmitter';

class OfflineQueue {
  constructor() {
    this.queue = [];
    this.isProcessing = false;
    this.loadQueue();
    this.setupNetworkListener();
  }

  async loadQueue() {
    try {
      const stored = await AsyncStorage.getItem('offline_queue');
      if (stored) {
        this.queue = JSON.parse(stored);
      }
    } catch (error) {
      console.error('Failed to load offline queue:', error);
    }
  }

  async saveQueue() {
    try {
      await AsyncStorage.setItem('offline_queue', JSON.stringify(this.queue));
    } catch (error) {
      console.error('Failed to save offline queue:', error);
    }
  }

  async setupNetworkListener() {
    // Check network status periodically instead of using event listener
    this.checkNetworkInterval = setInterval(async () => {
      const networkState = await Network.getNetworkStateAsync();
      if (networkState.isConnected && this.queue.length > 0 && !this.isProcessing) {
        this.processQueue();
      }
    }, 5000);
    
    // Initial check
    const networkState = await Network.getNetworkStateAsync();
    if (networkState.isConnected && this.queue.length > 0) {
      this.processQueue();
    }
  }

  addToQueue(action) {
    const item = {
      id: Date.now().toString(),
      ...action,
      retryCount: 0,
      timestamp: new Date().toISOString(),
    };
    this.queue.push(item);
    this.saveQueue();
    eventEmitter.emit(EVENTS.OFFLINE_QUEUE_UPDATED, this.queue.length);
    
    // Try to process immediately if online
    this.checkAndProcess();
  }

  async checkAndProcess() {
    const networkState = await Network.getNetworkStateAsync();
    if (networkState.isConnected && !this.isProcessing) {
      this.processQueue();
    }
  }

  async processQueue() {
    if (this.isProcessing || this.queue.length === 0) return;

    this.isProcessing = true;
    eventEmitter.emit(EVENTS.OFFLINE_PROCESSING, true);

    const items = [...this.queue];
    const results = [];

    for (const item of items) {
      try {
        let response;
        switch (item.type) {
          case 'create_post':
            response = await api.post('/content', item.data);
            break;
          case 'update_post':
            response = await api.put(`/content/${item.id}`, item.data);
            break;
          case 'delete_post':
            response = await api.delete(`/content/${item.id}`);
            break;
          case 'send_message':
            response = await api.post(`/conversations/${item.conversationId}/messages`, { message: item.message });
            break;
          case 'reply_comment':
            response = await api.post(`/comments/${item.commentId}/reply`, { message: item.message });
            break;
          case 'like_post':
            response = await api.post(`/posts/${item.postId}/like`);
            break;
          default:
            console.warn('Unknown action type:', item.type);
            continue;
        }

        // Remove from queue on success
        this.queue = this.queue.filter(q => q.id !== item.id);
        results.push({ success: true, item });
        eventEmitter.emit(EVENTS.OFFLINE_ACTION_SYNCED, item);
      } catch (error) {
        // Increment retry count
        item.retryCount++;
        
        if (item.retryCount >= 3) {
          // Remove after 3 failed attempts
          this.queue = this.queue.filter(q => q.id !== item.id);
          eventEmitter.emit(EVENTS.OFFLINE_ACTION_FAILED, item, error);
        }
        
        results.push({ success: false, item, error });
      }
    }

    await this.saveQueue();
    
    this.isProcessing = false;
    eventEmitter.emit(EVENTS.OFFLINE_PROCESSING, false);
    eventEmitter.emit(EVENTS.OFFLINE_QUEUE_PROCESSED, { 
      success: results.filter(r => r.success).length, 
      failed: results.filter(r => !r.success).length 
    });

    // Process again if more items were added during processing
    if (this.queue.length > 0) {
      this.processQueue();
    }
  }

  getQueueSize() {
    return this.queue.length;
  }

  getQueueItems() {
    return this.queue;
  }

  clearQueue() {
    this.queue = [];
    this.saveQueue();
    eventEmitter.emit(EVENTS.OFFLINE_QUEUE_CLEARED);
  }

  cleanup() {
    if (this.checkNetworkInterval) {
      clearInterval(this.checkNetworkInterval);
    }
  }
}

export default new OfflineQueue();