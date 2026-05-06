import api from './apiService';

class BusinessService {
  async getBusinesses() {
    const response = await api.get('/business');
    return response.data.businesses;
  }

  async getBusiness(id) {
    const response = await api.get(`/business/${id}`);
    return response.data.business;
  }

  async createBusiness(businessData) {
    const response = await api.post('/business', businessData);
    return response.data.business;
  }

  async updateBusiness(id, businessData) {
    const response = await api.put(`/business/${id}`, businessData);
    return response.data.business;
  }

  async deleteBusiness(id) {
    const response = await api.delete(`/business/${id}`);
    return response.data;
  }

  async switchBusiness(businessId) {
    const response = await api.post(`/business/switch/${businessId}`);
    return response.data;
  }

  async getTeamMembers(businessId) {
    const response = await api.get(`/business/${businessId}/team`);
    return response.data.teamMembers;
  }

  async inviteMember(businessId, email, role, permissions = []) {
    const response = await api.post(`/business/${businessId}/team/invite`, {
      email,
      role,
      permissions
    });
    return response.data;
  }

  async updateMemberRole(businessId, memberId, role, permissions) {
    const response = await api.put(`/business/${businessId}/team/${memberId}`, {
      role,
      permissions
    });
    return response.data;
  }

  async removeMember(businessId, memberId) {
    const response = await api.delete(`/business/${businessId}/team/${memberId}`);
    return response.data;
  }

  async getBusinessStats(businessId) {
    const response = await api.get(`/business/${businessId}/stats`);
    return response.data.stats;
  }

  async updateBrandVoice(businessId, brandVoice) {
    const response = await api.put(`/business/${businessId}/brand-voice`, { brandVoice });
    return response.data;
  }

  async updateTargetAudience(businessId, targetAudience) {
    const response = await api.put(`/business/${businessId}/target-audience`, { targetAudience });
    return response.data;
  }

  async addCompetitor(businessId, competitor) {
    const response = await api.post(`/business/${businessId}/competitors`, { competitor });
    return response.data;
  }

  async updateCompetitor(businessId, competitorId, data) {
    const response = await api.put(`/business/${businessId}/competitors/${competitorId}`, data);
    return response.data;
  }

  async removeCompetitor(businessId, competitorId) {
    const response = await api.delete(`/business/${businessId}/competitors/${competitorId}`);
    return response.data;
  }

  async getSettings(businessId) {
    const response = await api.get(`/business/${businessId}/settings`);
    return response.data.settings;
  }

  async updateSettings(businessId, settings) {
    const response = await api.put(`/business/${businessId}/settings`, { settings });
    return response.data;
  }

  async getIntegrations(businessId) {
    const response = await api.get(`/business/${businessId}/integrations`);
    return response.data.integrations;
  }

  async addIntegration(businessId, integration) {
    const response = await api.post(`/business/${businessId}/integrations`, integration);
    return response.data;
  }

  async updateIntegration(businessId, integrationId, data) {
    const response = await api.put(`/business/${businessId}/integrations/${integrationId}`, data);
    return response.data;
  }

  async removeIntegration(businessId, integrationId) {
    const response = await api.delete(`/business/${businessId}/integrations/${integrationId}`);
    return response.data;
  }

  async syncIntegration(businessId, integrationId) {
    const response = await api.post(`/business/${businessId}/integrations/${integrationId}/sync`);
    return response.data;
  }
}

export default new BusinessService();