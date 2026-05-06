import api from './apiService';

class NotificationService {
  async getNotifications(params = {}) {
    const response = await api.get('/notifications', { params });
    return response.data;
  }

  async getNotification(id) {
    const response = await api.get(`/notifications/${id}`);
    return response.data.notification;
  }

  async markAsRead(id) {
    const response = await api.post(`/notifications/${id}/read`);
    return response.data;
  }

  async markAllAsRead() {
    const response = await api.post('/notifications/mark-all-read');
    return response.data;
  }

  async deleteNotification(id) {
    const response = await api.delete(`/notifications/${id}`);
    return response.data;
  }

  async deleteAllNotifications() {
    const response = await api.delete('/notifications');
    return response.data;
  }

  async getSettings() {
    const response = await api.get('/notifications/settings');
    return response.data.settings;
  }

  async updateSettings(settings) {
    const response = await api.put('/notifications/settings', settings);
    return response.data;
  }

  async getStats() {
    const response = await api.get('/notifications/stats');
    return response.data.stats;
  }

  async testNotification(channel) {
    const response = await api.post('/notifications/test', { channel });
    return response.data;
  }

  async subscribePush(subscription) {
    const response = await api.post('/notifications/push/subscribe', { subscription });
    return response.data;
  }

  async unsubscribePush(endpoint) {
    const response = await api.post('/notifications/push/unsubscribe', { endpoint });
    return response.data;
  }

  async getTemplates() {
    const response = await api.get('/notifications/templates');
    return response.data.templates;
  }

  async sendCustomNotification(userIds, data) {
    const response = await api.post('/notifications/admin/send', { userIds, ...data });
    return response.data;
  }

  async getUnreadCount() {
    const response = await api.get('/notifications/unread-count');
    return response.data.count;
  }

  async getNotificationPreferences() {
    const response = await api.get('/notifications/preferences');
    return response.data.preferences;
  }

  async updateNotificationPreferences(preferences) {
    const response = await api.put('/notifications/preferences', preferences);
    return response.data;
  }

  async muteBusiness(businessId, duration) {
    const response = await api.post(`/notifications/business/${businessId}/mute`, { duration });
    return response.data;
  }

  async unmuteBusiness(businessId) {
    const response = await api.post(`/notifications/business/${businessId}/unmute`);
    return response.data;
  }

  async getDigestSettings() {
    const response = await api.get('/notifications/digest');
    return response.data.settings;
  }

  async updateDigestSettings(settings) {
    const response = await api.put('/notifications/digest', settings);
    return response.data;
  }

  async sendTestDigest() {
    const response = await api.post('/notifications/digest/test');
    return response.data;
  }

  async getNotificationChannels() {
    const response = await api.get('/notifications/channels');
    return response.data.channels;
  }

  async enableChannel(channel) {
    const response = await api.post(`/notifications/channels/${channel}/enable`);
    return response.data;
  }

  async disableChannel(channel) {
    const response = await api.post(`/notifications/channels/${channel}/disable`);
    return response.data;
  }

  async getNotificationHistory(params = {}) {
    const response = await api.get('/notifications/history', { params });
    return response.data;
  }

  async getNotificationAnalytics(params = {}) {
    const response = await api.get('/notifications/analytics', { params });
    return response.data;
  }

  async scheduleNotification(data) {
    const response = await api.post('/notifications/schedule', data);
    return response.data;
  }

  async cancelScheduledNotification(notificationId) {
    const response = await api.delete(`/notifications/schedule/${notificationId}`);
    return response.data;
  }

  async getScheduledNotifications() {
    const response = await api.get('/notifications/scheduled');
    return response.data;
  }
}

export default new NotificationService();