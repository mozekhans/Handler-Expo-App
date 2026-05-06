import apiService from './apiService';

export const businessApi = {
  // Create new business
  createBusiness: async (businessData) => {
    const response = await apiService.post('/business', businessData);
    return response;
  },

  // Get all businesses for current user
  getBusinesses: async () => {
    const response = await apiService.get('/business');
    return response;
  },

  // Get specific business details
  getBusiness: async (businessId) => {
    const response = await apiService.get(`/business/${businessId}`);
    return response;
  },

  // Update business
  updateBusiness: async (businessId, updateData) => {
    const response = await apiService.put(`/business/${businessId}`, updateData);
    return response;
  },

  // Delete business
  deleteBusiness: async (businessId) => {
    const response = await apiService.delete(`/business/${businessId}`);
    return response;
  },

  // Switch current business
  switchBusiness: async (businessId) => {
    const response = await apiService.post(`/business/switch/${businessId}`);
    return response;
  },

  // Get business stats
  getBusinessStats: async (businessId) => {
    const response = await apiService.get(`/business/${businessId}/stats`);
    return response;
  },

  // Update brand voice
  updateBrandVoice: async (businessId, brandVoice) => {
    const response = await apiService.put(`/business/${businessId}/brand-voice`, { brandVoice });
    return response;
  },

  // Update target audience
  updateTargetAudience: async (businessId, targetAudience) => {
    const response = await apiService.put(`/business/${businessId}/target-audience`, { targetAudience });
    return response;
  },

  // Get team members
  getTeamMembers: async (businessId) => {
    const response = await apiService.get(`/business/${businessId}/team`);
    return response;
  },

  // Invite team member
  inviteTeamMember: async (businessId, email, role, permissions) => {
    const response = await apiService.post(`/business/${businessId}/team/invite`, {
      email,
      role,
      permissions
    });
    return response;
  },

  // Update team member
  updateTeamMember: async (businessId, memberId, role, permissions) => {
    const response = await apiService.put(`/business/${businessId}/team/${memberId}`, {
      role,
      permissions
    });
    return response;
  },

  // Remove team member
  removeTeamMember: async (businessId, memberId) => {
    const response = await apiService.delete(`/business/${businessId}/team/${memberId}`);
    return response;
  },

  // Get competitors
  getCompetitors: async (businessId, params = {}) => {
    const queryString = new URLSearchParams(params).toString();
    const endpoint = `/business/${businessId}/competitors${queryString ? `?${queryString}` : ''}`;
    const response = await apiService.get(endpoint);
    return response;
  },

  // Add competitor
  addCompetitor: async (businessId, competitorData) => {
    const response = await apiService.post(`/business/${businessId}/competitors/${competitorId}`, competitorData);
    return response;
  },

  // Update competitor
  updateCompetitor: async (businessId, competitorId, updateData) => {
    const response = await apiService.put(`/business/${businessId}/competitors/${competitorId}`, updateData);
    return response;
  },

  // Remove competitor
  removeCompetitor: async (businessId, competitorId) => {
    const response = await apiService.delete(`/business/${businessId}/competitors/${competitorId}`);
    return response;
  },

  // Get settings
  getSettings: async (businessId) => {
    const response = await apiService.get(`/business/${businessId}/settings`);
    return response;
  },

  // Update settings
  updateSettings: async (businessId, settings) => {
    const response = await apiService.put(`/business/${businessId}/settings`, { settings });
    return response;
  },

  // Get integrations
  getIntegrations: async (businessId) => {
    const response = await apiService.get(`/business/${businessId}/integrations`);
    return response;
  },

  // Add integration
  addIntegration: async (businessId, integrationData) => {
    const response = await apiService.post(`/business/${businessId}/integrations`, integrationData);
    return response;
  },

  // Update integration
  updateIntegration: async (businessId, integrationId, updateData) => {
    const response = await apiService.put(`/business/${businessId}/integrations/${integrationId}`, updateData);
    return response;
  },

  // Remove integration
  removeIntegration: async (businessId, integrationId) => {
    const response = await apiService.delete(`/business/${businessId}/integrations/${integrationId}`);
    return response;
  },

  // Sync integration
  syncIntegration: async (businessId, integrationId) => {
    const response = await apiService.post(`/business/${businessId}/integrations/${integrationId}/sync`);
    return response;
  }
};

export default businessApi;