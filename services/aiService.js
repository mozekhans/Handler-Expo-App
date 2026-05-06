import api from './apiService';

class AIService {
  async generateContent(businessId, platform, options = {}) {
    const response = await api.post(`/business/${businessId}/ai/generate-content`, {
      platform,
      ...options
    });
    return response.data.content;
  }

  async optimizeContent(content, platform, businessId) {
    const response = await api.post(`/business/${businessId}/ai/optimize-content`, {
      content,
      platform
    });
    return response.data.optimized;
  }

  async generateHashtags(content, businessId, count = 10) {
    const response = await api.post(`/business/${businessId}/ai/generate-hashtags`, {
      content,
      count
    });
    return response.data.hashtags;
  }

  async analyzeSentiment(text) {
    const response = await api.post('/ai/analyze-sentiment', { text });
    return response.data.analysis;
  }

  async generateResponse(context, options = {}) {
    const response = await api.post('/ai/generate-response', { context, options });
    return response.data.response;
  }

  async predictPerformance(content, platforms, businessId) {
    const response = await api.post(`/business/${businessId}/ai/predict-performance`, {
      content,
      platforms
    });
    return response.data.predictions;
  }

  async detectTrends(businessId, params = {}) {
    const response = await api.get(`/business/${businessId}/ai/detect-trends`, { params });
    return response.data.trends;
  }

  async generateImage(prompt, businessId, options = {}) {
    const response = await api.post(`/business/${businessId}/ai/generate-image`, {
      prompt,
      ...options
    });
    return response.data.image;
  }

  async generateVideo(script, businessId, options = {}) {
    const response = await api.post(`/business/${businessId}/ai/generate-video`, {
      script,
      ...options
    });
    return response.data.video;
  }

  async generateVoiceover(text, businessId, options = {}) {
    const response = await api.post(`/business/${businessId}/ai/generate-voiceover`, {
      text,
      ...options
    });
    return response.data.audio;
  }

  async getSuggestions(businessId, type = 'all') {
    const response = await api.get(`/business/${businessId}/ai/suggestions`, {
      params: { type }
    });
    return response.data.suggestions;
  }

  async getLearningData(businessId) {
    const response = await api.get(`/business/${businessId}/ai/learning-data`);
    return response.data.learningData;
  }

  async updateLearningData(businessId, feedback) {
    const response = await api.put(`/business/${businessId}/ai/learning-data`, { feedback });
    return response.data;
  }

  async trainModel(businessId, modelType) {
    const response = await api.post(`/business/${businessId}/ai/train-model`, { modelType });
    return response.data.result;
  }

  async getModelPerformance(businessId, model, timeRange) {
    const response = await api.get(`/business/${businessId}/ai/model-performance`, {
      params: { model, timeRange }
    });
    return response.data;
  }

  async getModelVersions(businessId, model) {
    const response = await api.get(`/business/${businessId}/ai/model-versions`, {
      params: { model }
    });
    return response.data.versions;
  }

  async retrainModel(businessId, model) {
    const response = await api.post(`/business/${businessId}/ai/retrain`, { model });
    return response.data;
  }

  async getContentSuggestions(businessId, params = {}) {
    const response = await api.get(`/business/${businessId}/ai/content-suggestions`, { params });
    return response.data.suggestions;
  }

  async predictViralPotential(businessId, contentId) {
    const response = await api.get(`/business/${businessId}/ai/predict-viral/${contentId}`);
    return response.data.prediction;
  }

  async optimizeForViral(businessId, contentId) {
    const response = await api.post(`/business/${businessId}/ai/optimize-viral/${contentId}`);
    return response.data.optimized;
  }

  async getTrends(businessId, params = {}) {
    const response = await api.get(`/business/${businessId}/ai/trends`, { params });
    return response.data.trends;
  }

  async getTrendAlerts(businessId) {
    const response = await api.get(`/business/${businessId}/ai/trend-alerts`);
    return response.data.alerts;
  }

  async subscribeToTrend(businessId, trendId) {
    const response = await api.post(`/business/${businessId}/ai/trends/${trendId}/subscribe`);
    return response.data;
  }

  async getRecommendations(businessId, params = {}) {
    const response = await api.get(`/business/${businessId}/ai/recommendations`, { params });
    return response.data.recommendations;
  }

  async applyRecommendation(businessId, recommendationId) {
    const response = await api.post(`/business/${businessId}/ai/recommendations/${recommendationId}/apply`);
    return response.data;
  }

  async dismissRecommendation(businessId, recommendationId) {
    const response = await api.post(`/business/${businessId}/ai/recommendations/${recommendationId}/dismiss`);
    return response.data;
  }

  async getRecommendationStats(businessId) {
    const response = await api.get(`/business/${businessId}/ai/recommendations/stats`);
    return response.data.stats;
  }

  async getAIConfig(businessId) {
    const response = await api.get(`/business/${businessId}/ai/config`);
    return response.data.config;
  }

  async updateAIConfig(businessId, config) {
    const response = await api.put(`/business/${businessId}/ai/config`, config);
    return response.data;
  }

  async testAIConfig(businessId, config) {
    const response = await api.post(`/business/${businessId}/ai/config/test`, config);
    return response.data;
  }

  async getAvailableModels() {
    const response = await api.get('/ai/models');
    return response.data.models;
  }

  async getTrainingData(businessId) {
    const response = await api.get(`/business/${businessId}/ai/training-data`);
    return response.data;
  }

  async uploadTrainingData(businessId, file) {
    const formData = new FormData();
    formData.append('file', file);
    
    const response = await api.post(`/business/${businessId}/ai/training-data`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });
    return response.data;
  }

  async deleteTrainingData(businessId, dataId) {
    const response = await api.delete(`/business/${businessId}/ai/training-data/${dataId}`);
    return response.data;
  }

  async validateTrainingData(businessId) {
    const response = await api.post(`/business/${businessId}/ai/training-data/validate`);
    return response.data;
  }
}

export default new AIService();