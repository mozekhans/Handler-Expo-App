// src/hooks/useIntegrations.js
import { useState, useEffect, useCallback } from 'react';
import BusinessApi from '../../services/businessApi';

export const useIntegrations = (businessId) => {
  const [integrations, setIntegrations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [syncingIntegrations, setSyncingIntegrations] = useState(new Set());

  const loadIntegrations = useCallback(async () => {
    if (!businessId) return;
    
    try {
      setLoading(true);
      setError(null);
      const response = await BusinessApi.getIntegrations(businessId);
      setIntegrations(response.integrations || []);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load integrations');
    } finally {
      setLoading(false);
    }
  }, [businessId]);

  const addIntegration = useCallback(async (data) => {
    try {
      setError(null);
      const response = await BusinessApi.addIntegration(businessId, data);
      await loadIntegrations();
      return response;
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to add integration');
      throw err;
    }
  }, [businessId, loadIntegrations]);

  const updateIntegration = useCallback(async (integrationId, data) => {
    try {
      setError(null);
      const response = await BusinessApi.updateIntegration(businessId, integrationId, data);
      await loadIntegrations();
      return response;
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update integration');
      throw err;
    }
  }, [businessId, loadIntegrations]);

  const removeIntegration = useCallback(async (integrationId) => {
    try {
      setError(null);
      await BusinessApi.removeIntegration(businessId, integrationId);
      await loadIntegrations();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to remove integration');
      throw err;
    }
  }, [businessId, loadIntegrations]);

  const syncIntegration = useCallback(async (integrationId) => {
    try {
      setSyncingIntegrations(prev => new Set(prev).add(integrationId));
      setError(null);
      const response = await BusinessApi.syncIntegration(businessId, integrationId);
      await loadIntegrations();
      return response;
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to sync integration');
      throw err;
    } finally {
      setSyncingIntegrations(prev => {
        const next = new Set(prev);
        next.delete(integrationId);
        return next;
      });
    }
  }, [businessId, loadIntegrations]);

  const getIntegrationByType = useCallback((type) => {
    return integrations.filter(i => i.type === type);
  }, [integrations]);

  const getIntegrationById = useCallback((integrationId) => {
    return integrations.find(i => i._id === integrationId);
  }, [integrations]);

  const getActiveIntegrations = useCallback(() => {
    return integrations.filter(i => i.status === 'active');
  }, [integrations]);

  const isIntegrationConnected = useCallback((type, provider) => {
    return integrations.some(i => i.type === type && i.provider === provider);
  }, [integrations]);

  const getIntegrationStatus = useCallback(() => {
    const total = integrations.length;
    const active = integrations.filter(i => i.status === 'active').length;
    const error = integrations.filter(i => i.status === 'error').length;
    const needsSync = integrations.filter(i => {
      if (!i.lastSync) return true;
      const hoursSinceSync = (Date.now() - new Date(i.lastSync).getTime()) / (1000 * 60 * 60);
      return hoursSinceSync > 24;
    }).length;

    return { total, active, error, needsSync };
  }, [integrations]);

  useEffect(() => {
    if (businessId) {
      loadIntegrations();
    }
  }, [businessId, loadIntegrations]);

  return {
    integrations,
    loading,
    error,
    syncingIntegrations,
    loadIntegrations,
    addIntegration,
    updateIntegration,
    removeIntegration,
    syncIntegration,
    getIntegrationByType,
    getIntegrationById,
    getActiveIntegrations,
    isIntegrationConnected,
    getIntegrationStatus,
  };
};