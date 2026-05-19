import api from '../api/axios';

export const subscriptionService = {
  getPlans: () => api.get('/subscription/plans'),
  getMySubscription: () => api.get('/subscription'),
  checkout: (planId, billingCycle) =>
    api.post('/subscription/checkout', { planId, billingCycle }),
  portal: () => api.post('/subscription/portal'),
  manualUpgrade: (planId) =>
    api.post('/subscription/manual-upgrade', { planId }),
};