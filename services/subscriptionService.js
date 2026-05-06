import api from './apiService';

class SubscriptionService {
  async getPlans() {
    const response = await api.get('/subscription/plans');
    return response.data;
  }

  async getCurrentSubscription() {
    try {
      const response = await api.get('/subscription');
      return response.data.subscription;
    } catch {
      return null;
    }
  }

  async createSubscription(planId, paymentMethodId, options = {}) {
    const response = await api.post('/subscription', {
      planId,
      paymentMethodId,
      ...options
    });
    return response.data;
  }

  async updateSubscription(planId, options = {}) {
    const response = await api.put('/subscription', { planId, ...options });
    return response.data;
  }

  async cancelSubscription(reason, feedback) {
    const response = await api.post('/subscription/cancel', { reason, feedback });
    return response.data;
  }

  async renewSubscription() {
    const response = await api.post('/subscription/renew');
    return response.data;
  }

  async getInvoices(params = {}) {
    const response = await api.get('/subscription/invoices', { params });
    return response.data;
  }

  async getInvoice(invoiceId) {
    const response = await api.get(`/subscription/invoices/${invoiceId}`);
    return response.data.invoice;
  }

  async downloadInvoice(invoiceId) {
    const response = await api.get(`/subscription/invoices/${invoiceId}/download`, {
      responseType: 'blob'
    });
    return response.data;
  }

  async emailInvoice(invoiceId) {
    const response = await api.post(`/subscription/invoices/${invoiceId}/email`);
    return response.data;
  }

  async updatePaymentMethod(paymentMethodId) {
    const response = await api.put('/subscription/payment-method', { paymentMethodId });
    return response.data;
  }

  async getPaymentMethods() {
    const response = await api.get('/subscription/payment-methods');
    return response.data.methods;
  }

  async addPaymentMethod(paymentMethodData) {
    const response = await api.post('/subscription/payment-methods', paymentMethodData);
    return response.data;
  }

  async deletePaymentMethod(methodId) {
    const response = await api.delete(`/subscription/payment-methods/${methodId}`);
    return response.data;
  }

  async setDefaultPaymentMethod(methodId) {
    const response = await api.post(`/subscription/payment-methods/${methodId}/default`);
    return response.data;
  }

  async getUsageStats(businessId) {
    const response = await api.get(`/business/${businessId}/subscription/usage`);
    return response.data.usage;
  }

  async getUsageHistory(businessId) {
    const response = await api.get(`/business/${businessId}/subscription/usage/history`);
    return response.data.history;
  }

  async getPaymentHistory() {
    const response = await api.get('/subscription/payment-history');
    return response.data.payments;
  }

  async getBillingHistory() {
    const response = await api.get('/subscription/billing-history');
    return response.data.history;
  }

  async applyCoupon(couponCode) {
    const response = await api.post('/subscription/apply-coupon', { couponCode });
    return response.data;
  }

  async getSubscriptionHistory() {
    const response = await api.get('/subscription/history');
    return response.data.subscriptions;
  }

  async getInvoicesByBusiness(businessId, params = {}) {
    const response = await api.get(`/business/${businessId}/invoices`, { params });
    return response.data;
  }

  async getUsageByBusiness(businessId) {
    const response = await api.get(`/business/${businessId}/usage`);
    return response.data.usage;
  }

  async checkFeatureAccess(businessId, feature) {
    const response = await api.get(`/business/${businessId}/subscription/features/${feature}`);
    return response.data.hasAccess;
  }

  async getUpcomingInvoice() {
    const response = await api.get('/subscription/upcoming-invoice');
    return response.data;
  }

  async getTaxRates() {
    const response = await api.get('/subscription/tax-rates');
    return response.data;
  }

  async getPaymentIntents() {
    const response = await api.get('/subscription/payment-intents');
    return response.data;
  }

  async confirmPaymentIntent(paymentIntentId, paymentMethodId) {
    const response = await api.post('/subscription/confirm-payment', {
      paymentIntentId,
      paymentMethodId
    });
    return response.data;
  }

  async getSubscriptionInvoices(subscriptionId) {
    const response = await api.get(`/subscription/${subscriptionId}/invoices`);
    return response.data;
  }

  async getSubscriptionUsage(subscriptionId) {
    const response = await api.get(`/subscription/${subscriptionId}/usage`);
    return response.data;
  }

  async pauseSubscription(subscriptionId) {
    const response = await api.post(`/subscription/${subscriptionId}/pause`);
    return response.data;
  }

  async resumeSubscription(subscriptionId) {
    const response = await api.post(`/subscription/${subscriptionId}/resume`);
    return response.data;
  }

  async getAvailableAddons() {
    const response = await api.get('/subscription/addons');
    return response.data;
  }

  async addAddon(addonId) {
    const response = await api.post('/subscription/addons', { addonId });
    return response.data;
  }

  async removeAddon(addonId) {
    const response = await api.delete(`/subscription/addons/${addonId}`);
    return response.data;
  }

  async getCoupons() {
    const response = await api.get('/subscription/coupons');
    return response.data;
  }

  async validateCoupon(couponCode) {
    const response = await api.get(`/subscription/coupons/${couponCode}/validate`);
    return response.data;
  }
}

export default new SubscriptionService();