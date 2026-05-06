// import { useContext } from 'react';
// import { SocialContext } from '../context/SocialContext';

// export const useSocial = () => {
//   const context = useContext(SocialContext);
//   if (!context) {
//     throw new Error('useSocial must be used within a SocialProvider');
//   }
//   return context;
// };








import { useState, useCallback } from 'react';
import socialService from '../services/socialService';
import { Alert } from 'react-native';

export const useSocialAccounts = (businessId) => {
  const [accounts, setAccounts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState(null);

  const fetchAccounts = useCallback(async () => {
    if (!businessId) return;
    
    try {
      setLoading(true);
      setError(null);
      const response = await socialService.getAccounts(businessId);
      setAccounts(response.accounts || []);
    } catch (err) {
      setError(err.message);
      console.error('Failed to fetch accounts:', err);
    } finally {
      setLoading(false);
    }
  }, [businessId]);

  const refreshAccounts = useCallback(async () => {
    try {
      setRefreshing(true);
      await fetchAccounts();
    } finally {
      setRefreshing(false);
    }
  }, [fetchAccounts]);

  const disconnectAccount = useCallback(async (accountId) => {
    try {
      const response = await socialService.disconnectAccount(businessId, accountId);
      Alert.alert('Success', response.message);
      await fetchAccounts();
    } catch (err) {
      Alert.alert('Error', err.message || 'Failed to disconnect account');
    }
  }, [businessId, fetchAccounts]);

  const syncAccount = useCallback(async (accountId) => {
    try {
      const response = await socialService.syncAccount(businessId, accountId);
      Alert.alert('Success', 'Account synced successfully');
      await fetchAccounts();
      return response.metrics;
    } catch (err) {
      Alert.alert('Error', err.message || 'Failed to sync account');
    }
  }, [businessId, fetchAccounts]);

  const syncAllAccounts = useCallback(async () => {
    try {
      const response = await socialService.syncAllAccounts(businessId);
      Alert.alert('Success', 'All accounts synced');
      await fetchAccounts();
      return response.results;
    } catch (err) {
      Alert.alert('Error', err.message || 'Failed to sync accounts');
    }
  }, [businessId, fetchAccounts]);

  return {
    accounts,
    loading,
    refreshing,
    error,
    fetchAccounts,
    refreshAccounts,
    disconnectAccount,
    syncAccount,
    syncAllAccounts,
  };
};