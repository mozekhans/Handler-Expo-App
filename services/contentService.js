// import api from './apiService';

// class ContentService {
//   async getContent(businessId, params = {}) {
//     const response = await api.get(`/content/business/${businessId}`, { params });
//     return response.data;
//   }

//   async getContentById(contentId) {
//     const response = await api.get(`/content/business/${businessId}/${contentId}`);
//     return response.data.content;
//   }

//   async createContent(businessId, contentData) {
//     const response = await api.post(`/content/business/${businessId}`, contentData);
//     return response.data.content;
//   }

//   async updateContent(contentId, contentData) {
//     const response = await api.put(`/content/business/${businessId}/${contentId}`, contentData);
//     return response.data.content;
//   }

//   async deleteContent(contentId) {
//     const response = await api.delete(`/content/business/${businessId}/${contentId}`);
//     return response.data;
//   }

//   async publishContent(contentId) {
//     const response = await api.post(`/content/business/${businessId}/${contentId}/publish`);
//     return response.data;
//   }

//   async scheduleContent(contentId, scheduledFor) {
//     const response = await api.post(`/content/business/${businessId}/${contentId}/schedule`, { scheduledFor });
//     return response.data;
//   }

//   async cancelSchedule(contentId) {
//     const response = await api.post(`/content/business/${businessId}/${contentId}/cancel-schedule`);
//     return response.data;
//   }

//   async duplicateContent(contentId) {
//     const response = await api.post(`/content/business/${businessId}/${contentId}/duplicate`);
//     return response.data.content;
//   }

//   async approveContent(contentId, comment) {
//     const response = await api.post(`/content/business/${businessId}/${contentId}/approve`, { comment });
//     return response.data;
//   }

//   async rejectContent(contentId, comment) {
//     const response = await api.post(`/content/business/${businessId}/${contentId}/reject`, { comment });
//     return response.data;
//   }

//   async getContentStats(businessId, params = {}) {
//     const response = await api.get(`/content/business/${businessId}/stats`, { params });
//     return response.data.stats;
//   }

//   async getContentCalendar(businessId, month, year) {
//     const response = await api.get(`/content/business/${businessId}/calendar`, {
//       params: { month, year }
//     });
//     return response.data.calendar;
//   }

//   async generateAIContent(businessId, platform, options) {
//     const response = await api.post(`/content/business/${businessId}/ai/generate`, {
//       platform,
//       options
//     });
//     return response.data.content;
//   }

//   async optimizeContent(businessId, content, platform) {
//     const response = await api.post(`/content/business/${businessId}/ai/optimize`, {
//       content,
//       platform
//     });
//     return response.data.optimized;
//   }

//   async getContentSuggestions(businessId) {
//     const response = await api.get(`/content/business/${businessId}/ai/suggestions`);
//     return response.data.suggestions;
//   }

//   async bulkCreateContent(businessId, contents) {
//     const response = await api.post(`/content/business/${businessId}/bulk`, { contents });
//     return response.data;
//   }

//   async exportContent(businessId, params) {
//     const response = await api.get(`/content/business/${businessId}/export`, {
//       params,
//       responseType: 'blob'
//     });
//     return response.data;
//   }

//   async analyzePerformance(contentId) {
//     const response = await api.get(`/content/business/${businessId}/${contentId}/analyze`);
//     return response.data.analysis;
//   }

//   async getScheduledContent(businessId, startDate, endDate) {
//     const response = await api.get(`/content/business/${businessId}/scheduled`, {
//       params: { startDate, endDate }
//     });
//     return response.data.content;
//   }

//   async getRecurringPosts(businessId) {
//     const response = await api.get(`/content/business/${businessId}/recurring`);
//     return response.data.posts;
//   }

//   async createRecurringPost(businessId, postData) {
//     const response = await api.post(`/content/business/${businessId}/recurring`, postData);
//     return response.data.post;
//   }

//   async updateRecurringPost(postId, postData) {
//     const response = await api.put(`/content/business/${businessId}/recurring/${postId}`, postData);
//     return response.data.post;
//   }

//   async deleteRecurringPost(postId) {
//     const response = await api.delete(`/content/business/${businessId}/recurring/${postId}`);
//     return response.data;
//   }
// }

// export default new ContentService();








import api from './apiService';

class ContentService {
  async getContent(businessId, params = {}) {
    const response = await api.get(`/content/business/${businessId}`, { params });
    return response.data;
  }

  async getContentById(businessId, contentId) {
    const response = await api.get(`/content/business/${businessId}/${contentId}`);
    return response.data.content;
  }

  async createContent(businessId, contentData) {
    const response = await api.post(`/content/business/${businessId}`, contentData);
    return response.data.content;
  }

  async updateContent(businessId, contentId, contentData) {
    const response = await api.put(`/content/business/${businessId}/${contentId}`, contentData);
    return response.data.content;
  }

  async deleteContent(businessId, contentId) {
    const response = await api.delete(`/content/business/${businessId}/${contentId}`);
    return response.data;
  }

  async publishContent(businessId, contentId) {
    const response = await api.post(`/content/business/${businessId}/${contentId}/publish`);
    return response.data;
  }

  async scheduleContent(businessId, contentId, scheduledFor) {
    const response = await api.post(`/content/business/${businessId}/${contentId}/schedule`, { scheduledFor });
    return response.data;
  }

  async cancelSchedule(businessId, contentId) {
    const response = await api.post(`/content/business/${businessId}/${contentId}/cancel-schedule`);
    return response.data;
  }

  async duplicateContent(businessId, contentId) {
    const response = await api.post(`/content/business/${businessId}/${contentId}/duplicate`);
    return response.data.content;
  }

  async approveContent(businessId, contentId, comment) {
    const response = await api.post(`/content/business/${businessId}/${contentId}/approve`, { comment });
    return response.data;
  }

  async rejectContent(businessId, contentId, comment) {
    const response = await api.post(`/content/business/${businessId}/${contentId}/reject`, { comment });
    return response.data;
  }

  async getContentStats(businessId, params = {}) {
    const response = await api.get(`/content/business/${businessId}/stats`, { params });
    return response.data.stats;
  }

  async getContentCalendar(businessId, month, year) {
    const response = await api.get(`/content/business/${businessId}/calendar`, {
      params: { month, year }
    });
    return response.data.calendar;
  }

  async generateAIContent(businessId, platform, options) {
    const response = await api.post(`/content/business/${businessId}/ai/generate`, {
      platform,
      options
    });
    return response.data.content;
  }

  async optimizeContent(businessId, content, platform) {
    const response = await api.post(`/content/business/${businessId}/ai/optimize`, {
      content,
      platform
    });
    return response.data.optimized;
  }

  async getContentSuggestions(businessId) {
    const response = await api.get(`/content/business/${businessId}/ai/suggestions`);
    return response.data.suggestions;
  }

  async bulkCreateContent(businessId, contents) {
    const response = await api.post(`/content/business/${businessId}/bulk`, { contents });
    return response.data;
  }

  async exportContent(businessId, params) {
    const response = await api.get(`/content/business/${businessId}/export`, {
      params,
      responseType: 'blob'
    });
    return response.data;
  }

  async analyzePerformance(businessId, contentId) {
    const response = await api.get(`/content/business/${businessId}/${contentId}/analyze`);
    return response.data.analysis;
  }

  async getScheduledContent(businessId, startDate, endDate) {
    const response = await api.get(`/content/business/${businessId}/scheduled`, {
      params: { startDate, endDate }
    });
    return response.data.content;
  }

  // These methods don't have backend routes yet, but we'll keep them for future implementation
  async getRecurringPosts(businessId) {
    const response = await api.get(`/content/business/${businessId}/recurring`);
    return response.data.posts;
  }

  async createRecurringPost(businessId, postData) {
    const response = await api.post(`/content/business/${businessId}/recurring`, postData);
    return response.data.post;
  }

  async updateRecurringPost(businessId, postId, postData) {
    const response = await api.put(`/content/business/${businessId}/recurring/${postId}`, postData);
    return response.data.post;
  }

  async deleteRecurringPost(businessId, postId) {
    const response = await api.delete(`/content/business/${businessId}/recurring/${postId}`);
    return response.data;
  }
}

export default new ContentService();