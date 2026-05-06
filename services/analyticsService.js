// import { Platform } from 'react-native';
// import * as Device from 'expo-device';
// import Constants from 'expo-constants';
// import * as Application from 'expo-application';
// import { eventEmitter } from '../utils/eventEmitter';
// import api from './apiService';

// class AnalyticsService {
//   constructor() {
//     this.sessionId = null;
//     this.startTime = null;
//     this.userId = null;
//     this.deviceInfo = {};
//     this.pendingEvents = [];
//     this.init();
//   }

//   async init() {
//     let deviceId = null;

//     try {
//       deviceId =
//         Platform.OS === 'android'
//           ? Application.androidId
//           : await Application.getIosIdForVendorAsync();
//     } catch (e) {
//       deviceId = 'unknown-device';
//     }

//     this.deviceInfo = {
//       platform: Platform.OS,
//       version: Constants.expoConfig?.version || '1.0.0',
//       buildNumber:
//         Constants.expoConfig?.ios?.buildNumber ||
//         Constants.expoConfig?.android?.versionCode ||
//         '1',
//       deviceId,
//       deviceName: Device.deviceName || 'unknown-device',
//       brand: Device.brand || 'unknown',
//       model: Device.modelName || 'unknown',
//       systemVersion: Device.osVersion || 'unknown',
//     };

//     this.startSession();
//     this.setupEventListeners();
//   }

//   startSession() {
//     this.sessionId = this.generateId();
//     this.startTime = Date.now();

//     this.trackEvent('session_start', {
//       sessionId: this.sessionId,
//       timestamp: new Date().toISOString(),
//     });
//   }

//   endSession() {
//     const duration = Date.now() - this.startTime;

//     this.trackEvent('session_end', {
//       sessionId: this.sessionId,
//       duration,
//       timestamp: new Date().toISOString(),
//     });
//   }

//   setupEventListeners() {
//     eventEmitter.on('app:background', () => {
//       this.trackEvent('app_background');
//     });

//     eventEmitter.on('app:foreground', () => {
//       this.trackEvent('app_foreground');
//     });
//   }

//   setUser(user) {
//     this.userId = user.id;

//     this.trackEvent('user_identified', {
//       userId: user.id,
//       email: user.email,
//       role: user.role,
//     });
//   }

//   trackScreen(screenName) {
//     this.trackEvent('screen_view', {
//       screen: screenName,
//       timestamp: new Date().toISOString(),
//     });
//   }

//   trackEvent(eventName, properties = {}) {
//     const event = {
//       name: eventName,
//       properties: {
//         ...properties,
//         userId: this.userId,
//         sessionId: this.sessionId,
//         deviceInfo: this.deviceInfo,
//         timestamp: new Date().toISOString(),
//       },
//     };

//     this.sendToBackend(event);

//     if (__DEV__) {
//       console.log('Analytics:', event);
//     }
//   }

//   // FIX: Better error handling for API responses
//   async sendToBackend(event) {
//     try {
//       const response = await api.post('/analytics/track', event);
      
//       // Check if response is valid
//       if (response && response.data) {
//         // Success - clear any pending events
//         if (this.pendingEvents.length > 0) {
//           this.processPendingEvents();
//         }
//       }
//     } catch (error) {
//       console.error('Analytics send error:', error.message || error);
      
//       // Don't queue events in development to avoid console spam
//       if (!__DEV__) {
//         this.queueEvent(event);
//       }
//     }
//   }

//   async processPendingEvents() {
//     const events = [...this.pendingEvents];
//     this.pendingEvents = [];
    
//     for (const event of events) {
//       try {
//         await api.post('/analytics/track', event);
//       } catch (error) {
//         console.error('Failed to send pending event:', error);
//         // Re-queue if needed
//         this.pendingEvents.push(event);
//         break;
//       }
//     }
//   }

//   queueEvent(event) {
//     // Limit queue size
//     if (this.pendingEvents.length > 100) {
//       this.pendingEvents.shift();
//     }
//     this.pendingEvents.push(event);
    
//     // Attempt to send queue after delay
//     if (this.queueTimeout) {
//       clearTimeout(this.queueTimeout);
//     }
//     this.queueTimeout = setTimeout(() => {
//       if (this.pendingEvents.length > 0) {
//         this.processPendingEvents();
//       }
//     }, 5000);
//   }

//   generateId() {
//     return `${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;
//   }
// }

// export default new AnalyticsService();








import api from './apiService';

class AnalyticsService {
  async getDashboard(businessId, params = {}) {
    const response = await api.get(`/analytics/dashboard/${businessId}`, { params });
    return response;
  }

  async getOverview(businessId, params = {}) {
    const response = await api.get(`/analytics/overview/${businessId}`, { params });
    return response;
  }

  async getEngagementMetrics(businessId, params = {}) {
    const response = await api.get(`/analytics/engagement/${businessId}`, { params });
    return response;
  }

  async getContentMetrics(businessId, params = {}) {
    const response = await api.get(`/analytics/content/${businessId}`, { params });
    return response;
  }

  async getAudienceMetrics(businessId, params = {}) {
    const response = await api.get(`/analytics/audience/${businessId}`, { params });
    return response;
  }

  async getCampaignMetrics(businessId, params = {}) {
    const response = await api.get(`/analytics/campaigns/${businessId}`, { params });
    return response;
  }

  async getCompetitorAnalysis(businessId, competitorIds = []) {
    const params = competitorIds.length ? { competitorIds: JSON.stringify(competitorIds) } : {};
    const response = await api.get(`/analytics/competitors/${businessId}`, { params });
    return response;
  }

  async getBenchmarks(businessId, params = {}) {
    const response = await api.get(`/analytics/benchmarks/${businessId}`, { params });
    return response;
  }

  async getTimeSeries(businessId, params = {}) {
    const response = await api.get(`/analytics/time-series/${businessId}`, { params });
    return response;
  }

  async getInsights(businessId) {
    const response = await api.get(`/analytics/insights/${businessId}`);
    return response;
  }

  async getAlerts(businessId, resolved = false) {
    const response = await api.get(`/analytics/alerts/${businessId}`, { params: { resolved } });
    return response;
  }

  async exportReport(businessId, reportData) {
    const response = await api.post(`/analytics/export-report/${businessId}`, reportData);
    return response;
  }

  async getReportStatus(businessId, reportId) {
    const response = await api.get(`/analytics/reports/${businessId}/${reportId}/status`);
    return response;
  }

  async downloadReport(businessId, reportId) {
    const response = await api.get(`/analytics/reports/${businessId}/${reportId}/download`, {
      responseType: 'blob',
    });
    return response;
  }

  async listReports(businessId, params = {}) {
    const response = await api.get(`/analytics/reports/${businessId}/list`, { params });
    return response;
  }

  async deleteReport(businessId, reportId) {
    const response = await api.delete(`/analytics/reports/${businessId}/${reportId}/delete`);
    return response;
  }

  async scheduleReport(businessId, scheduleData) {
    const response = await api.post(`/analytics/schedule/${businessId}`, scheduleData);
    return response;
  }
}

export default new AnalyticsService();