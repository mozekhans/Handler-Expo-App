// export default new SocialService();

import apiService from "./apiService";

class SocialService {
  /**
   * Get OAuth URL for platform
   */

  // async getAuthUrl(businessId, platform, redirectUri) {
  //   const response = await apiService.get(`/social/auth/${platform}`, {
  //     params: {
  //       redirectUri,
  //       businessId,
  //     },
  //   });
  //   return response.data;
  // }

  async getAuthUrl(businessId, platform, redirectUri) { 
    const response = await apiService.get(
      `/social/business/${businessId}/auth/${platform}`,
      {
        params: {
          redirectUri,
        },
      }
    );
    return response;
  }

  /**
   * Connect social media account
   */
  async connectAccount(businessId, platform, code, redirectUri) {
    const response = await apiService.post(
      `/social/business/${businessId}/connect`,
      {
        platform,
        code,
        redirectUri,
      },
    );
    return response;
  }

  /**
   * Get all connected accounts
   */
  async getAccounts(businessId) {
    const response = await apiService.get(
      `/social/business/${businessId}/accounts`,
    );
    return response;
  }

  /**
   * Get single account details
   */
  async getAccount(businessId, accountId) {
    const response = await apiService.get(
      `/social/business/${businessId}/accounts/${accountId}`,
    );
    return response;
  }

  /**
   * Update account settings
   */
  async updateAccount(businessId, accountId, settings) {
    const response = await apiService.put(
      `/social/business/${businessId}/accounts/${accountId}`,
      {
        settings,
      },
    );
    return response.data;
  }

  /**
   * Disconnect account
   */
  async disconnectAccount(businessId, accountId) {
    const response = await apiService.delete(
      `/social/business/${businessId}/accounts/${accountId}`,
    );
    return response.data;
  }

  /**
   * Refresh account token
   */
  async refreshToken(businessId, accountId) {
    const response = await apiService.post(
      `/social/business/${businessId}/accounts/${accountId}/refresh-token`,
    );
    return response.data;
  }

  /**
   * Sync single account
   */
  async syncAccount(businessId, accountId) {
    const response = await apiService.post(
      `/social/business/${businessId}/accounts/${accountId}/sync`,
    );
    return response.data;
  }

  /**
   * Sync all accounts
   */
  async syncAllAccounts(businessId) {
    const response = await apiService.post(
      `/social/business/${businessId}/sync-all`,
    );
    return response.data;
  }

  /**
   * Create webhook
   */
  // async createWebhook(businessId, accountId, url, events, secret = null) {
  //   const response = await apiService.post(
  //     `/business/${businessId}/social/accounts/${accountId}/webhooks`,
  //     {
  //       url,
  //       events,
  //       secret,
  //     },
  //   );
  //   return response.data;
  // }

  async createWebhook(businessId, accountId, webhookData) {
    const response = await apiService.post(
      `/social/business/${businessId}/accounts/${accountId}/webhooks`,
      webhookData,
    );
    return response.data;
  }

  /**
   * Delete webhook
   */
  async deleteWebhook(businessId, accountId, webhookId) {
    const response = await apiService.delete(
      `/social/business/${businessId}/accounts/${accountId}/webhooks/${webhookId}`,
    );
    return response.data;
  }

  /**
   * Test webhook
   */
  async testWebhook(businessId, accountId, webhookId) {
    const response = await apiService.post(
      `/social/business/${businessId}/accounts/${accountId}/webhooks/${webhookId}/test`,
    );
    return response.data;
  }

  /**
   * Get account insights (platform specific)
   */
  async getAccountInsights(businessId, accountId, params = {}) {
    // This would be a platform-specific endpoint
    const response = await apiService.get(
      `/social/business/${businessId}/accounts/${accountId}/insights`,
      { params },
    );
    return response.data;
  }

  /**
   * Get account metrics
   */
  async getAccountMetrics(businessId, accountId) {
    const response = await apiService.get(
      `/social/business/${businessId}/accounts/${accountId}/metrics`,
    );
    return response.data;
  }

  /**
   * Get posts for account
   */
  async getPosts(businessId, accountId, params = {}) {
    const response = await apiService.get(
      `/social/business/${businessId}/accounts/${accountId}/posts`,
      { params },
    );
    return response.data;
  }

  /**
   * Get comments for post
   */
  async getComments(businessId, accountId, postId, params = {}) {
    const response = await apiService.get(
      `/business/${businessId}/social/accounts/${accountId}/posts/${postId}/comments`,
      { params },
    );
    return response.data;
  }

  /**
   * Reply to comment
   */
  async replyToComment(businessId, accountId, commentId, message) {
    const response = await apiService.post(
      `/business/${businessId}/social/accounts/${accountId}/comments/${commentId}/reply`,
      {
        message,
      },
    );
    return response.data;
  }

  /**
   * Get messages for account
   */
  async getMessages(businessId, accountId, params = {}) {
    const response = await apiService.get(
      `/business/${businessId}/social/accounts/${accountId}/messages`,
      { params },
    );
    return response.data;
  }

  /**
   * Send message
   */
  async sendMessage(businessId, accountId, recipientId, message) {
    const response = await apiService.post(
      `/business/${businessId}/social/accounts/${accountId}/messages`,
      {
        recipientId,
        message,
      },
    );
    return response.data;
  }

  /**
   * Get mentions for account
   */
  async getMentions(businessId, accountId, params = {}) {
    const response = await apiService.get(
      `/business/${businessId}/social/accounts/${accountId}/mentions`,
      { params },
    );
    return response.data;
  }

  /**
   * Get trending hashtags
   */
  async getTrendingHashtags(businessId, accountId, platform) {
    const response = await apiService.get(
      `/business/${businessId}/social/accounts/${accountId}/hashtags/trending`,
      {
        params: { platform },
      },
    );
    return response.data;
  }

  /**
   * Search hashtags
   */
  async searchHashtags(businessId, accountId, query, platform) {
    const response = await apiService.get(
      `/business/${businessId}/social/accounts/${accountId}/hashtags/search`,
      {
        params: { query, platform },
      },
    );
    return response.data;
  }

  /**
   * Get scheduled posts
   */
  async getScheduledPosts(businessId, accountId, params = {}) {
    const response = await apiService.get(
      `/business/${businessId}/social/accounts/${accountId}/scheduled`,
      { params },
    );
    return response.data;
  }

  /**
   * Cancel scheduled post
   */
  async cancelScheduledPost(businessId, accountId, scheduledId) {
    const response = await apiService.delete(
      `/business/${businessId}/social/accounts/${accountId}/scheduled/${scheduledId}`,
    );
    return response.data;
  }

  /**
   * Get drafts
   */
  async getDrafts(businessId, accountId, params = {}) {
    const response = await apiService.get(
      `/business/${businessId}/social/accounts/${accountId}/drafts`,
      { params },
    );
    return response.data;
  }

  /**
   * Save draft
   */
  async saveDraft(businessId, accountId, content) {
    const response = await apiService.post(
      `/business/${businessId}/social/accounts/${accountId}/drafts`,
      { content },
    );
    return response.data;
  }

  /**
   * Update draft
   */
  async updateDraft(businessId, accountId, draftId, content) {
    const response = await apiService.put(
      `/business/${businessId}/social/accounts/${accountId}/drafts/${draftId}`,
      { content },
    );
    return response.data;
  }

  /**
   * Delete draft
   */
  async deleteDraft(businessId, accountId, draftId) {
    const response = await apiService.delete(
      `/business/${businessId}/social/accounts/${accountId}/drafts/${draftId}`,
    );
    return response.data;
  }

  /**
   * Get stories
   */
  async getStories(businessId, accountId) {
    const response = await apiService.get(
      `/business/${businessId}/social/accounts/${accountId}/stories`,
    );
    return response.data;
  }

  /**
   * Get story insights
   */
  async getStoryInsights(businessId, accountId, storyId) {
    const response = await apiService.get(
      `/business/${businessId}/social/accounts/${accountId}/stories/${storyId}/insights`,
    );
    return response.data;
  }

  /**
   * Get media library
   */
  async getMedia(businessId, accountId, params = {}) {
    const response = await apiService.get(
      `/business/${businessId}/social/accounts/${accountId}/media`,
      { params },
    );
    return response.data;
  }

  /**
   * Upload media
   */
  async uploadMedia(businessId, accountId, file) {
    const formData = new FormData();
    formData.append("file", {
      uri: file.uri,
      type: file.type || "image/jpeg",
      name: file.name || "media.jpg",
    });

    const response = await apiService.post(
      `/business/${businessId}/social/accounts/${accountId}/media`,
      formData,
      {
        headers: { "Content-Type": "multipart/form-data" },
      },
    );
    return response.data;
  }

  /**
   * Delete media
   */
  async deleteMedia(businessId, accountId, mediaId) {
    const response = await apiService.delete(
      `/business/${businessId}/social/accounts/${accountId}/media/${mediaId}`,
    );
    return response.data;
  }

  /**
   * Get account health
   */
  async getAccountHealth(businessId, accountId) {
    const response = await apiService.get(
      `/business/${businessId}/social/accounts/${accountId}/health`,
    );
    return response.data;
  }

  /**
   * Get rate limits
   */
  async getRateLimits(businessId, accountId) {
    const response = await apiService.get(
      `/business/${businessId}/social/accounts/${accountId}/rate-limits`,
    );
    return response.data;
  }

  /**
   * Get account settings
   */
  async getAccountSettings(businessId, accountId) {
    const response = await apiService.get(
      `/business/${businessId}/social/accounts/${accountId}/settings`,
    );
    return response.data;
  }

  /**
   * Update account settings
   */
  async updateAccountSettings(businessId, accountId, settings) {
    const response = await apiService.put(
      `/business/${businessId}/social/accounts/${accountId}/settings`,
      settings,
    );
    return response.data;
  }

  /**
   * Get default posting times
   */
  async getDefaultPostingTimes(businessId, accountId) {
    const response = await apiService.get(
      `/business/${businessId}/social/accounts/${accountId}/default-times`,
    );
    return response.data;
  }

  /**
   * Update default posting times
   */
  async updateDefaultPostingTimes(businessId, accountId, times) {
    const response = await apiService.put(
      `/business/${businessId}/social/accounts/${accountId}/default-times`,
      { times },
    );
    return response.data;
  }
}

export default new SocialService();
