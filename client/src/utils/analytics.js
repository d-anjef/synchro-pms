import ReactGA from 'react-ga4';

const GA_ID = import.meta.env.VITE_GA_ID;

export const initAnalytics = () => {
  if (GA_ID && import.meta.env.PROD) {
    ReactGA.initialize(GA_ID);
    console.log('📊 Analytics initialized');
  }
};

export const trackPageView = (path) => {
  if (GA_ID && import.meta.env.PROD) {
    ReactGA.send({ hitType: 'pageview', page: path });
  }
};

export const trackEvent = (category, action, label, value) => {
  if (GA_ID && import.meta.env.PROD) {
    ReactGA.event({ category, action, label, value });
  }
};

// Common event helpers
export const trackSignup = (method) => trackEvent('User', 'Sign Up', method);
export const trackLogin = (method) => trackEvent('User', 'Login', method);
export const trackUpgrade = (plan) => trackEvent('Revenue', 'Upgrade', plan);
export const trackPayment = (plan, amount) =>
  trackEvent('Revenue', 'Payment Completed', plan, amount);
export const trackTaskCreated = () => trackEvent('Engagement', 'Task Created');
export const trackProjectCreated = () => trackEvent('Engagement', 'Project Created');