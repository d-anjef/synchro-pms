import api from '../api/axios';

export const paymentService = {
  initiateEsewa: (planId, billingCycle) =>
    api.post('/payment/esewa/initiate', { planId, billingCycle }),
  initiateKhalti: (planId, billingCycle) =>
    api.post('/payment/khalti/initiate', { planId, billingCycle }),
  getHistory: () => api.get('/payment/history'),
  cancelSubscription: () => api.post('/payment/cancel'),
};