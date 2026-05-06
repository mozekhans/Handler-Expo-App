// import api from './apiService';

// class EngagementService {
//   async getEngagements(businessId, params = {}) {
//     const response = await api.get(`/business/${businessId}/engagement`, { params });
//     return response.data;
//   }

//   async getEngagement(engagementId) {
//     const response = await api.get(`/engagement/${engagementId}`);
//     return response.data.engagement;
//   }

//   async replyToEngagement(engagementId, message, options = {}) {
//     const response = await api.post(`/engagement/${engagementId}/reply`, {
//       message,
//       ...options
//     });
//     return response.data;
//   }

//   async resolveEngagement(engagementId) {
//     const response = await api.post(`/engagement/${engagementId}/resolve`);
//     return response.data;
//   }

//   async assignEngagement(engagementId, userId) {
//     const response = await api.post(`/engagement/${engagementId}/assign`, { userId });
//     return response.data;
//   }

//   async deleteEngagement(engagementId) {
//     const response = await api.delete(`/engagement/${engagementId}`);
//     return response.data;
//   }

//   async markAsSpam(engagementId) {
//     const response = await api.post(`/engagement/${engagementId}/spam`);
//     return response.data;
//   }

//   async markAsRead(engagementId) {
//     const response = await api.post(`/engagement/${engagementId}/read`);
//     return response.data;
//   }

//   async addNote(engagementId, note) {
//     const response = await api.post(`/engagement/${engagementId}/notes`, { note });
//     return response.data;
//   }

//   async addTag(engagementId, tag) {
//     const response = await api.post(`/engagement/${engagementId}/tags`, { tag });
//     return response.data;
//   }

//   async removeTag(engagementId, tag) {
//     const response = await api.delete(`/engagement/${engagementId}/tags/${tag}`);
//     return response.data;
//   }

//   async getConversation(engagementId) {
//     const response = await api.get(`/engagement/${engagementId}/conversation`);
//     return response.data.conversation;
//   }

//   async getStats(businessId, params = {}) {
//     const response = await api.get(`/business/${businessId}/engagement/stats`, { params });
//     return response.data.stats;
//   }

//   async bulkReply(businessId, data) {
//     const response = await api.post(`/business/${businessId}/engagement/bulk-reply`, data);
//     return response.data;
//   }

//   async exportEngagements(businessId, params) {
//     const response = await api.get(`/business/${businessId}/engagement/export`, {
//       params,
//       responseType: 'blob'
//     });
//     return response.data;
//   }

//   // Quick Replies
//   async getQuickReplies(businessId) {
//     const response = await api.get(`/business/${businessId}/engagement/quick-replies`);
//     return response.data.quickReplies;
//   }

//   async createQuickReply(businessId, data) {
//     const response = await api.post(`/business/${businessId}/engagement/quick-replies`, data);
//     return response.data.quickReply;
//   }

//   async updateQuickReply(replyId, data) {
//     const response = await api.put(`/engagement/quick-replies/${replyId}`, data);
//     return response.data.quickReply;
//   }

//   async deleteQuickReply(replyId) {
//     const response = await api.delete(`/engagement/quick-replies/${replyId}`);
//     return response.data;
//   }

//   async reorderQuickReplies(order) {
//     const response = await api.post('/engagement/quick-replies/reorder', { order });
//     return response.data;
//   }

//   // Auto-Respond Rules
//   async getAutoRespondRules(businessId) {
//     const response = await api.get(`/business/${businessId}/engagement/auto-respond-rules`);
//     return response.data.rules;
//   }

//   async createRule(businessId, ruleData) {
//     const response = await api.post(`/business/${businessId}/engagement/auto-respond-rules`, ruleData);
//     return response.data.rule;
//   }

//   async updateRule(ruleId, ruleData) {
//     const response = await api.put(`/engagement/auto-respond-rules/${ruleId}`, ruleData);
//     return response.data.rule;
//   }

//   async deleteRule(ruleId) {
//     const response = await api.delete(`/engagement/auto-respond-rules/${ruleId}`);
//     return response.data;
//   }

//   async reorderRules(order) {
//     const response = await api.post('/engagement/auto-respond-rules/reorder', { order });
//     return response.data;
//   }

//   // Messages/Inbox
//   async getConversations(businessId, params = {}) {
//     const response = await api.get(`/business/${businessId}/engagement/conversations`, { params });
//     return response.data.conversations;
//   }

//   async getMessages(conversationId) {
//     const response = await api.get(`/engagement/conversations/${conversationId}/messages`);
//     return response.data.messages;
//   }

//   async sendMessage(conversationId, message) {
//     const response = await api.post(`/engagement/conversations/${conversationId}/messages`, { message });
//     return response.data.message;
//   }

//   async archiveConversation(conversationId) {
//     const response = await api.post(`/engagement/conversations/${conversationId}/archive`);
//     return response.data;
//   }

//   async deleteMessage(messageId) {
//     const response = await api.delete(`/engagement/messages/${messageId}`);
//     return response.data;
//   }

//   // Comments
//   async getComments(businessId, params = {}) {
//     const response = await api.get(`/business/${businessId}/engagement/comments`, { params });
//     return response.data;
//   }

//   async replyToComment(commentId, message) {
//     const response = await api.post(`/engagement/comments/${commentId}/reply`, { message });
//     return response.data;
//   }

//   async moderateComment(commentId, action) {
//     const response = await api.post(`/engagement/comments/${commentId}/moderate`, { action });
//     return response.data;
//   }

//   async deleteComment(commentId) {
//     const response = await api.delete(`/engagement/comments/${commentId}`);
//     return response.data;
//   }

//   async pinComment(commentId) {
//     const response = await api.post(`/engagement/comments/${commentId}/pin`);
//     return response.data;
//   }

//   async likeComment(commentId) {
//     const response = await api.post(`/engagement/comments/${commentId}/like`);
//     return response.data;
//   }

//   // Mentions
//   async getMentions(businessId, params = {}) {
//     const response = await api.get(`/business/${businessId}/engagement/mentions`, { params });
//     return response.data;
//   }

//   async replyToMention(mentionId, message) {
//     const response = await api.post(`/engagement/mentions/${mentionId}/reply`, { message });
//     return response.data;
//   }

//   async deleteMention(mentionId) {
//     const response = await api.delete(`/engagement/mentions/${mentionId}`);
//     return response.data;
//   }

//   async getMentionAnalytics(businessId) {
//     const response = await api.get(`/business/${businessId}/engagement/mentions/analytics`);
//     return response.data.analytics;
//   }

//   // Sentiment Analysis
//   async getSentimentAnalytics(businessId, params = {}) {
//     const response = await api.get(`/business/${businessId}/engagement/sentiment`, { params });
//     return response.data.analytics;
//   }
// }

// export default new EngagementService();























// services/engagementService.js
import apiService from './apiService';

class EngagementService {
  // ============================================
  // GET /business/:businessId/engagement
  // Get all engagements with filtering, pagination
  // ============================================
  async getEngagements(businessId, params = {}) {
    try {
      const queryParams = new URLSearchParams();
      
      if (params.page) queryParams.append('page', params.page);
      if (params.limit) queryParams.append('limit', params.limit);
      if (params.type) queryParams.append('type', params.type);
      if (params.platform) queryParams.append('platform', params.platform);
      if (params.sentiment) queryParams.append('sentiment', params.sentiment);
      if (params.priority) queryParams.append('priority', params.priority);
      if (params.status) queryParams.append('status', params.status);
      if (params.search) queryParams.append('search', params.search);
      if (params.startDate) queryParams.append('startDate', params.startDate);
      if (params.endDate) queryParams.append('endDate', params.endDate);
      if (params.assignedTo) queryParams.append('assignedTo', params.assignedTo);
      if (params.tags) queryParams.append('tags', params.tags);
      if (params.intent) queryParams.append('intent', params.intent);

      const response = await apiService.get(
        `/engagement/${businessId}?${queryParams.toString()}`
      );
      return response.data;
    } catch (error) {
      throw this._handleError(error, 'Failed to fetch engagements');
    }
  }

  // ============================================
  // GET /business/:businessId/engagement/:engagementId
  // Get single engagement by ID
  // ============================================
  async getEngagement(businessId, engagementId) {
    try {
      const response = await apiService.get(
        `/engagement/${businessId}/${engagementId}`
      );
      return response.data;
    } catch (error) {
      throw this._handleError(error, 'Failed to fetch engagement');
    }
  }

  // ============================================
  // POST /business/:businessId/engagement/:engagementId/reply
  // Reply to a single engagement
  // ============================================
  async replyToEngagement(businessId, engagementId, data) {
    try {
      const response = await apiService.post(
        `/engagement/${businessId}/${engagementId}/reply`,
        {
          message: data.message,
          aiGenerated: data.aiGenerated || false,
        }
      );
      return response.data;
    } catch (error) {
      throw this._handleError(error, 'Failed to send reply');
    }
  }

  // ============================================
  // POST /business/:businessId/engagement/bulk-reply
  // Bulk reply to multiple engagements
  // ============================================
  async bulkReply(businessId, data) {
    try {
      const response = await apiService.post(
        `/engagement/${businessId}/bulk-reply`,
        {
          engagementIds: data.engagementIds,
          message: data.message,
          aiGenerated: data.aiGenerated || false,
        }
      );
      return response.data;
    } catch (error) {
      throw this._handleError(error, 'Failed to send bulk replies');
    }
  }

  // ============================================
  // POST /business/:businessId/engagement/ai/generate-response/:businessId
  // Generate AI response
  // ============================================
  async generateAIResponse(businessId, data) {
    try {
      const response = await apiService.post(
        `/engagement/${businessId}/ai/generate-response`,
        {
          text: data.text,
          context: data.context || {},
          platform: data.platform,
          originalContent: data.originalContent,
          commentText: data.commentText || data.text,
          comment: data.comment || data.text,
          options: {
            tone: data.context?.tone,
            maxTokens: data.maxTokens || 300,
            temperature: data.temperature || 0.7,
            ...data.options,
          },
        }
      );
      return response.data;
    } catch (error) {
      throw this._handleError(error, 'Failed to generate AI response');
    }
  }

  // ============================================
  // POST /business/:businessId/engagement/ai/generate-response/bulk
  // Generate bulk AI responses
  // ============================================
  async generateBulkAIResponses(businessId, data) {
    try {
      const response = await apiService.post(
        `/engagement/${businessId}/ai/generate-response`,
        {
          platform: data.platform,
          comments: data.comments,
          options: data.options || {},
        }
      );
      return response.data;
    } catch (error) {
      throw this._handleError(error, 'Failed to generate bulk AI responses');
    }
  }

  // ============================================
  // POST /business/:businessId/engagement/ai/analyze-sentiment
  // Analyze sentiment of text
  // ============================================
  async analyzeSentiment(businessId, text) {
    try {
      const response = await apiService.post(
        `/engagement/${businessId}/ai/analyze-sentiment`,
        { text }
      );
      return response.data;
    } catch (error) {
      throw this._handleError(error, 'Failed to analyze sentiment');
    }
  }

  // ============================================
  // POST /business/:businessId/engagement/:engagementId/assign
  // Assign engagement to a team member
  // ============================================
  async assignEngagement(businessId, engagementId, userId) {
    try {
      const response = await apiService.post(
        `/engagement/${businessId}/${engagementId}/assign`,
        { userId }
      );
      return response.data;
    } catch (error) {
      throw this._handleError(error, 'Failed to assign engagement');
    }
  }

  // ============================================
  // POST /business/:businessId/engagement/:engagementId/spam
  // Mark engagement as spam
  // ============================================
  async markAsSpam(businessId, engagementId) {
    try {
      const response = await apiService.post(
        `/engagement/${businessId}/${engagementId}/spam`
      );
      return response.data;
    } catch (error) {
      throw this._handleError(error, 'Failed to mark as spam');
    }
  }

  // ============================================
  // POST /business/:businessId/engagement/:engagementId/read
  // Mark single engagement as read
  // ============================================
  async markAsRead(businessId, engagementId) {
    try {
      const response = await apiService.post(
        `/engagement/${businessId}/${engagementId}/read`
      );
      return response.data;
    } catch (error) {
      throw this._handleError(error, 'Failed to mark as read');
    }
  }

  // ============================================
  // POST /business/:businessId/engagement/mark-all-read
  // Mark all engagements as read
  // ============================================
  async markAllAsRead(businessId) {
    try {
      const response = await apiService.post(
        `/engagement/${businessId}/mark-all-read`
      );
      return response.data;
    } catch (error) {
      throw this._handleError(error, 'Failed to mark all as read');
    }
  }

  // ============================================
  // POST /business/:businessId/engagement/:engagementId/notes
  // Add internal note to engagement
  // ============================================
  async addNote(businessId, engagementId, noteData) {
    try {
      const response = await apiService.post(
        `/engagement/${businessId}/${engagementId}/notes`,
        {
          note: typeof noteData === 'string' ? noteData : noteData.text,
          category: noteData.category,
        }
      );
      return response.data;
    } catch (error) {
      throw this._handleError(error, 'Failed to add note');
    }
  }

  // ============================================
  // POST /business/:businessId/engagement/:engagementId/tags
  // Add tag to engagement
  // ============================================
  async addTag(businessId, engagementId, tag) {
    try {
      const response = await apiService.post(
        `/engagement/${businessId}/${engagementId}/tags`,
        { tag }
      );
      return response.data;
    } catch (error) {
      throw this._handleError(error, 'Failed to add tag');
    }
  }

  // ============================================
  // DELETE /business/:businessId/engagement/:engagementId/tags/:tag
  // Remove tag from engagement
  // ============================================
  async removeTag(businessId, engagementId, tag) {
    try {
      const response = await apiService.delete(
        `/engagement/${businessId}/${engagementId}/tags/${encodeURIComponent(tag)}`
      );
      return response.data;
    } catch (error) {
      throw this._handleError(error, 'Failed to remove tag');
    }
  }

  // ============================================
  // GET /business/:businessId/engagement/:engagementId/conversation
  // Get full conversation thread
  // ============================================
  async getConversation(businessId, engagementId) {
    try {
      const response = await apiService.get(
        `/engagement/${businessId}/${engagementId}/conversation`
      );
      return response.data;
    } catch (error) {
      throw this._handleError(error, 'Failed to get conversation');
    }
  }

  // ============================================
  // GET /business/:businessId/engagement/stats
  // Get engagement statistics
  // ============================================
  async getStats(businessId, params = {}) {
    try {
      const queryParams = new URLSearchParams();
      if (params.startDate) queryParams.append('startDate', params.startDate);
      if (params.endDate) queryParams.append('endDate', params.endDate);

      const response = await apiService.get(
        `/engagement/${businessId}/stats?${queryParams.toString()}`
      );
      return response.data;
    } catch (error) {
      throw this._handleError(error, 'Failed to get stats');
    }
  }

  // ============================================
  // GET /business/:businessId/engagement/export
  // Export engagements data
  // ============================================
  async exportEngagements(businessId, params = {}) {
    try {
      const queryParams = new URLSearchParams();
      if (params.format) queryParams.append('format', params.format);
      if (params.startDate) queryParams.append('startDate', params.startDate);
      if (params.endDate) queryParams.append('endDate', params.endDate);
      if (params.type) queryParams.append('type', params.type);
      if (params.platform) queryParams.append('platform', params.platform);
      if (params.sentiment) queryParams.append('sentiment', params.sentiment);

      const response = await apiService.get(
        `/engagement/${businessId}/export?${queryParams.toString()}`,
        { responseType: 'blob' }
      );
      return response.data;
    } catch (error) {
      throw this._handleError(error, 'Failed to export engagements');
    }
  }

  // ============================================
  // GET /business/:businessId/engagement/analytics
  // Get engagement analytics
  // ============================================
  async getAnalytics(businessId, dateRange = {}) {
    try {
      const queryParams = new URLSearchParams();
      if (dateRange.startDate) queryParams.append('startDate', dateRange.startDate);
      if (dateRange.endDate) queryParams.append('endDate', dateRange.endDate);

      const response = await apiService.get(
        `/engagement/${businessId}/stats?${queryParams.toString()}`
      );
      return response.data;
    } catch (error) {
      throw this._handleError(error, 'Failed to get analytics');
    }
  }

  // ============================================
  // POST /business/:businessId/engagement/bulk-action
  // Perform bulk actions on engagements
  // ============================================
  async bulkAction(businessId, engagementIds, action, data = {}) {
    try {
      const response = await apiService.post(
        `/engagement/${businessId}/bulk-action`,
        {
          engagementIds,
          action,
          ...data,
        }
      );
      return response.data;
    } catch (error) {
      throw this._handleError(error, 'Failed to perform bulk action');
    }
  }

  // ============================================
  // Helper: Convert engagements data to CSV format
  // ============================================
  convertToCSV(engagements) {
    const headers = [
      'ID',
      'Type',
      'Platform',
      'User',
      'Content',
      'Sentiment',
      'Priority',
      'Status',
      'Created At',
      'Replied',
      'Assigned To',
    ];

    const rows = [headers];

    engagements.forEach((item) => {
      rows.push([
        item._id,
        item.type,
        item.platform,
        item.user?.name || item.user?.username || '',
        (item.content?.text || '').substring(0, 100),
        item.sentiment,
        item.priority,
        item.replied ? 'Replied' : item.read ? 'Read' : 'Unread',
        new Date(item.createdAt).toLocaleString(),
        item.replied ? 'Yes' : 'No',
        item.assignedTo
          ? `${item.assignedTo.firstName} ${item.assignedTo.lastName}`
          : '',
      ]);
    });

    return rows.map((row) => row.join(',')).join('\n');
  }

  // ============================================
  // Helper: Error handling
  // ============================================
  _handleError(error, defaultMessage = 'An error occurred') {
    if (error.response) {
      const { status, data } = error.response;
      const message = data?.message || data?.error || defaultMessage;
      const errorObj = new Error(message);
      errorObj.status = status;
      errorObj.code = data?.code;
      errorObj.data = data;
      return errorObj;
    } else if (error.request) {
      const errorObj = new Error('Network error. Please check your connection.');
      errorObj.status = 0;
      errorObj.code = 'NETWORK_ERROR';
      return errorObj;
    } else {
      const errorObj = new Error(error.message || defaultMessage);
      errorObj.status = -1;
      errorObj.code = 'UNKNOWN_ERROR';
      return errorObj;
    }
  }
}

// Create singleton instance
const engagementService = new EngagementService();

export default engagementService;