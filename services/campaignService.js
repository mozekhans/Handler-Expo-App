import api from './apiService';

class CampaignService {
  async getCampaigns(businessId, params = {}) {
    const response = await api.get(`/business/${businessId}/campaigns`, { params });
    return response.data.campaigns;
  }

  async getCampaign(campaignId) {
    const response = await api.get(`/campaigns/${campaignId}`);
    return response.data.campaign;
  }

  async createCampaign(businessId, campaignData) {
    const response = await api.post(`/business/${businessId}/campaigns`, campaignData);
    return response.data.campaign;
  }

  async updateCampaign(campaignId, campaignData) {
    const response = await api.put(`/campaigns/${campaignId}`, campaignData);
    return response.data.campaign;
  }

  async deleteCampaign(campaignId) {
    const response = await api.delete(`/campaigns/${campaignId}`);
    return response.data;
  }

  async startCampaign(campaignId) {
    const response = await api.post(`/campaigns/${campaignId}/start`);
    return response.data;
  }

  async pauseCampaign(campaignId) {
    const response = await api.post(`/campaigns/${campaignId}/pause`);
    return response.data;
  }

  async completeCampaign(campaignId) {
    const response = await api.post(`/campaigns/${campaignId}/complete`);
    return response.data;
  }

  async duplicateCampaign(campaignId) {
    const response = await api.post(`/campaigns/${campaignId}/duplicate`);
    return response.data.campaign;
  }

  async getCampaignStats(businessId) {
    const response = await api.get(`/business/${businessId}/campaigns/stats`);
    return response.data.stats;
  }

  async getCampaignAnalytics(campaignId, params = {}) {
    const response = await api.get(`/campaigns/${campaignId}/analytics`, { params });
    return response.data.analytics;
  }

  async exportCampaignAnalytics(campaignId, params) {
    const response = await api.get(`/campaigns/${campaignId}/analytics/export`, {
      params,
      responseType: 'blob'
    });
    return response.data;
  }

  async addContent(campaignId, contentId) {
    const response = await api.post(`/campaigns/${campaignId}/content`, { contentId });
    return response.data;
  }

  async removeContent(campaignId, contentId) {
    const response = await api.delete(`/campaigns/${campaignId}/content/${contentId}`);
    return response.data;
  }

  async getABTests(campaignId) {
    const response = await api.get(`/campaigns/${campaignId}/ab-tests`);
    return response.data.tests;
  }

  async createABTest(campaignId, testData) {
    const response = await api.post(`/campaigns/${campaignId}/ab-tests`, testData);
    return response.data.test;
  }

  async updateABTest(testId, testData) {
    const response = await api.put(`/campaigns/ab-tests/${testId}`, testData);
    return response.data.test;
  }

  async deleteABTest(testId) {
    const response = await api.delete(`/campaigns/ab-tests/${testId}`);
    return response.data;
  }

  async startABTest(testId) {
    const response = await api.post(`/campaigns/ab-tests/${testId}/start`);
    return response.data;
  }

  async stopABTest(testId) {
    const response = await api.post(`/campaigns/ab-tests/${testId}/stop`);
    return response.data;
  }

  async getABTestResults(testId) {
    const response = await api.get(`/campaigns/ab-tests/${testId}/results`);
    return response.data;
  }

  async addNote(campaignId, note) {
    const response = await api.post(`/campaigns/${campaignId}/notes`, { note });
    return response.data;
  }

  async getPerformance(campaignId) {
    const response = await api.get(`/campaigns/${campaignId}/performance`);
    return response.data.performance;
  }
}

export default new CampaignService();