import React, { createContext, useState } from 'react';
import campaignService from '../services/campaignService';
import { useBusiness } from '../hooks/useBusiness';

export const CampaignContext = createContext();

export const CampaignProvider = ({ children }) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [campaigns, setCampaigns] = useState([]);
  const [currentCampaign, setCurrentCampaign] = useState(null);
  const { currentBusiness } = useBusiness();

  const getCampaigns = async (businessId = null, params = {}) => {
    const id = businessId || currentBusiness?.id;
    if (!id) return [];
    try {
      setLoading(true);
      const data = await campaignService.getCampaigns(id, params);
      setCampaigns(data);
      return data;
    } catch (err) {
      setError(err.message || 'Failed to load campaigns');
      return [];
    } finally {
      setLoading(false);
    }
  };

  const getCampaign = async (campaignId) => {
    try {
      setLoading(true);
      const data = await campaignService.getCampaign(campaignId);
      setCurrentCampaign(data);
      return data;
    } catch (err) {
      setError(err.message || 'Failed to load campaign');
      return null;
    } finally {
      setLoading(false);
    }
  };

  const createCampaign = async (businessId = null, campaignData) => {
    const id = businessId || currentBusiness?.id;
    if (!id) return null;
    try {
      setLoading(true);
      const data = await campaignService.createCampaign(id, campaignData);
      setCampaigns(prev => [data, ...prev]);
      return data;
    } catch (err) {
      setError(err.message || 'Failed to create campaign');
      return null;
    } finally {
      setLoading(false);
    }
  };

  const updateCampaign = async (campaignId, campaignData) => {
    try {
      setLoading(true);
      const data = await campaignService.updateCampaign(campaignId, campaignData);
      setCampaigns(prev => prev.map(c => c.id === campaignId ? data : c));
      if (currentCampaign?.id === campaignId) {
        setCurrentCampaign(data);
      }
      return data;
    } catch (err) {
      setError(err.message || 'Failed to update campaign');
      return null;
    } finally {
      setLoading(false);
    }
  };

  const deleteCampaign = async (campaignId) => {
    try {
      setLoading(true);
      await campaignService.deleteCampaign(campaignId);
      setCampaigns(prev => prev.filter(c => c.id !== campaignId));
      if (currentCampaign?.id === campaignId) {
        setCurrentCampaign(null);
      }
      return true;
    } catch (err) {
      setError(err.message || 'Failed to delete campaign');
      return false;
    } finally {
      setLoading(false);
    }
  };

  const startCampaign = async (campaignId) => {
    try {
      const data = await campaignService.startCampaign(campaignId);
      setCampaigns(prev => prev.map(c => c.id === campaignId ? { ...c, status: 'active' } : c));
      return data;
    } catch (err) {
      setError(err.message || 'Failed to start campaign');
      return null;
    }
  };

  const pauseCampaign = async (campaignId) => {
    try {
      const data = await campaignService.pauseCampaign(campaignId);
      setCampaigns(prev => prev.map(c => c.id === campaignId ? { ...c, status: 'paused' } : c));
      return data;
    } catch (err) {
      setError(err.message || 'Failed to pause campaign');
      return null;
    }
  };

  const completeCampaign = async (campaignId) => {
    try {
      const data = await campaignService.completeCampaign(campaignId);
      setCampaigns(prev => prev.map(c => c.id === campaignId ? { ...c, status: 'completed' } : c));
      return data;
    } catch (err) {
      setError(err.message || 'Failed to complete campaign');
      return null;
    }
  };

  const duplicateCampaign = async (campaignId) => {
    try {
      const data = await campaignService.duplicateCampaign(campaignId);
      setCampaigns(prev => [data, ...prev]);
      return data;
    } catch (err) {
      setError(err.message || 'Failed to duplicate campaign');
      return null;
    }
  };

  const getCampaignAnalytics = async (campaignId, params = {}) => {
    try {
      const data = await campaignService.getCampaignAnalytics(campaignId, params);
      return data;
    } catch (err) {
      setError(err.message || 'Failed to load campaign analytics');
      return null;
    }
  };

  const getCampaignStats = async (businessId = null) => {
    const id = businessId || currentBusiness?.id;
    if (!id) return null;
    try {
      const data = await campaignService.getCampaignStats(id);
      return data;
    } catch (err) {
      setError(err.message || 'Failed to load campaign stats');
      return null;
    }
  };

  const getABTests = async (campaignId) => {
    try {
      const data = await campaignService.getABTests(campaignId);
      return data;
    } catch (err) {
      setError(err.message || 'Failed to load A/B tests');
      return [];
    }
  };

  const createABTest = async (campaignId, testData) => {
    try {
      const data = await campaignService.createABTest(campaignId, testData);
      return data;
    } catch (err) {
      setError(err.message || 'Failed to create A/B test');
      return null;
    }
  };

  const value = {
    campaigns,
    currentCampaign,
    loading,
    error,
    getCampaigns,
    getCampaign,
    createCampaign,
    updateCampaign,
    deleteCampaign,
    startCampaign,
    pauseCampaign,
    completeCampaign,
    duplicateCampaign,
    getCampaignAnalytics,
    getCampaignStats,
    getABTests,
    createABTest,
  };

  return (
    <CampaignContext.Provider value={value}>
      {children}
    </CampaignContext.Provider>
  );
};