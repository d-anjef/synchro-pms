// Frontend mirror of backend plans (for quick access without API call)
export const PLAN_NAMES = {
  free: 'Free',
  pro: 'Pro',
  business: 'Business',
  enterprise: 'Enterprise',
};

export const hasFeatureFromPlan = (plan, feature) => {
  const features = {
    free: {
      fileUploads: false,
      realtime: false,
      analytics: false,
      adminPanel: false,
      portfolio: false,
      goals: false,
      reporting: false,
    },
    pro: {
      fileUploads: true,
      realtime: true,
      analytics: false,
      adminPanel: false,
      portfolio: false,
      goals: true,
      reporting: false,
    },
    business: {
      fileUploads: true,
      realtime: true,
      analytics: true,
      adminPanel: true,
      portfolio: true,
      goals: true,
      reporting: true,
    },
    enterprise: {
      fileUploads: true,
      realtime: true,
      analytics: true,
      adminPanel: true,
      portfolio: true,
      goals: true,
      reporting: true,
    },
  };
  return features[plan]?.[feature] === true;
};

export const getTrialDaysLeft = (trialEndsAt) => {
  if (!trialEndsAt) return 0;
  const diff = new Date(trialEndsAt) - new Date();
  return Math.max(0, Math.ceil(diff / (1000 * 60 * 60 * 24)));
};