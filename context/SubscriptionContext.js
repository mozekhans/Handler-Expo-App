import React, { createContext, useState } from 'react';
import subscriptionService from '../services/subscriptionService';
import { useBusiness } from '../hooks/useBusiness';

export const SubscriptionContext = createContext();

export const SubscriptionProvider = ({ children }) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [currentSubscription, setCurrentSubscription] = useState(null);
  const { currentBusiness } = useBusiness();

  const getCurrentSubscription = async () => {
    try {
      setLoading(true);
      const data = await subscriptionService.getCurrentSubscription();
      setCurrentSubscription(data);
      return data;
    } catch (err) {
      setError(err.message || 'Failed to load subscription');
      return null;
    } finally {
      setLoading(false);
    }
  };

  const getPlans = async () => {
    try {
      const data = await subscriptionService.getPlans();
      return data;
    } catch (err) {
      setError(err.message || 'Failed to load plans');
      return [];
    }
  };

  const createSubscription = async (planId, paymentMethodId, options = {}) => {
    try {
      setLoading(true);
      const data = await subscriptionService.createSubscription(planId, paymentMethodId, options);
      setCurrentSubscription(data.subscription);
      return data;
    } catch (err) {
      setError(err.message || 'Failed to create subscription');
      return null;
    } finally {
      setLoading(false);
    }
  };

  const updateSubscription = async (planId, options = {}) => {
    try {
      setLoading(true);
      const data = await subscriptionService.updateSubscription(planId, options);
      setCurrentSubscription(data.subscription);
      return data;
    } catch (err) {
      setError(err.message || 'Failed to update subscription');
      return null;
    } finally {
      setLoading(false);
    }
  };

  const cancelSubscription = async (reason = null, feedback = null) => {
    try {
      setLoading(true);
      const data = await subscriptionService.cancelSubscription(reason, feedback);
      setCurrentSubscription(null);
      return data;
    } catch (err) {
      setError(err.message || 'Failed to cancel subscription');
      return null;
    } finally {
      setLoading(false);
    }
  };

  const getInvoices = async (params = {}) => {
    try {
      const data = await subscriptionService.getInvoices(params);
      return data;
    } catch (err) {
      setError(err.message || 'Failed to load invoices');
      return [];
    }
  };

  const getInvoice = async (invoiceId) => {
    try {
      const data = await subscriptionService.getInvoice(invoiceId);
      return data;
    } catch (err) {
      setError(err.message || 'Failed to load invoice');
      return null;
    }
  };

  const downloadInvoice = async (invoiceId) => {
    try {
      const data = await subscriptionService.downloadInvoice(invoiceId);
      return data;
    } catch (err) {
      setError(err.message || 'Failed to download invoice');
      return null;
    }
  };

  const emailInvoice = async (invoiceId) => {
    try {
      const data = await subscriptionService.emailInvoice(invoiceId);
      return data;
    } catch (err) {
      setError(err.message || 'Failed to email invoice');
      return null;
    }
  };

  const getPaymentMethods = async () => {
    try {
      const data = await subscriptionService.getPaymentMethods();
      return data;
    } catch (err) {
      setError(err.message || 'Failed to load payment methods');
      return [];
    }
  };

  const addPaymentMethod = async (paymentMethodData) => {
    try {
      const data = await subscriptionService.addPaymentMethod(paymentMethodData);
      return data;
    } catch (err) {
      setError(err.message || 'Failed to add payment method');
      return null;
    }
  };

  const deletePaymentMethod = async (methodId) => {
    try {
      const data = await subscriptionService.deletePaymentMethod(methodId);
      return data;
    } catch (err) {
      setError(err.message || 'Failed to delete payment method');
      return null;
    }
  };

  const setDefaultPaymentMethod = async (methodId) => {
    try {
      const data = await subscriptionService.setDefaultPaymentMethod(methodId);
      return data;
    } catch (err) {
      setError(err.message || 'Failed to set default payment method');
      return null;
    }
  };

  const getUsageStats = async (businessId = null) => {
    const id = businessId || currentBusiness?.id;
    if (!id) return null;
    try {
      const data = await subscriptionService.getUsageStats(id);
      return data;
    } catch (err) {
      setError(err.message || 'Failed to load usage stats');
      return null;
    }
  };

  const checkFeatureAccess = async (feature, businessId = null) => {
    const id = businessId || currentBusiness?.id;
    if (!id) return false;
    try {
      const hasAccess = await subscriptionService.checkFeatureAccess(id, feature);
      return hasAccess;
    } catch (err) {
      return false;
    }
  };

  const applyCoupon = async (couponCode) => {
    try {
      const data = await subscriptionService.applyCoupon(couponCode);
      return data;
    } catch (err) {
      setError(err.message || 'Failed to apply coupon');
      return null;
    }
  };

  const value = {
    currentSubscription,
    loading,
    error,
    getCurrentSubscription,
    getPlans,
    createSubscription,
    updateSubscription,
    cancelSubscription,
    getInvoices,
    getInvoice,
    downloadInvoice,
    emailInvoice,
    getPaymentMethods,
    addPaymentMethod,
    deletePaymentMethod,
    setDefaultPaymentMethod,
    getUsageStats,
    checkFeatureAccess,
    applyCoupon,
  };

  return (
    <SubscriptionContext.Provider value={value}>
      {children}
    </SubscriptionContext.Provider>
  );
};