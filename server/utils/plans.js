export const PLANS = {
  free: {
    id: 'free',
    name: 'Free',
    price: { monthly: 0, yearly: 0 },
    currency: 'NPR',
    limits: {
      projects: 3,
      tasksPerProject: 20,
      teamMembers: 1,
      storageGB: 0,
      fileUploads: false,
      realtime: false,
      analytics: false,
      adminPanel: false,
      portfolio: false,
      goals: false,
      reporting: false,
    },
    features: [
      'Up to 3 projects',
      '20 tasks per project',
      'Solo workspace',
      'Basic kanban board',
      'Light & dark mode',
    ],
  },
  pro: {
    id: 'pro',
    name: 'Pro',
    price: { monthly: 999, yearly: 9999 },
    currency: 'NPR',
    limits: {
      projects: -1,
      tasksPerProject: -1,
      teamMembers: 10,
      storageGB: 10,
      fileUploads: true,
      realtime: true,
      analytics: false,
      adminPanel: false,
      portfolio: false,
      goals: true,
      reporting: false,
    },
    features: [
      'Unlimited projects & tasks',
      'Up to 10 team members',
      '10 GB file storage',
      'Realtime collaboration',
      'Goals tracking',
      'Email notifications',
      'Priority support',
    ],
    popular: true,
  },
  business: {
    id: 'business',
    name: 'Business',
    price: { monthly: 2999, yearly: 29999 },
    currency: 'NPR',
    limits: {
      projects: -1,
      tasksPerProject: -1,
      teamMembers: 50,
      storageGB: 100,
      fileUploads: true,
      realtime: true,
      analytics: true,
      adminPanel: true,
      portfolio: true,
      goals: true,
      reporting: true,
    },
    features: [
      'Everything in Pro',
      'Up to 50 team members',
      '100 GB file storage',
      'Advanced reporting & analytics',
      'Portfolio overview',
      'Admin panel',
      'Activity logs',
      'Dedicated support',
    ],
  },
  enterprise: {
    id: 'enterprise',
    name: 'Enterprise',
    price: { monthly: null, yearly: null },
    currency: 'NPR',
    limits: {
      projects: -1,
      tasksPerProject: -1,
      teamMembers: -1,
      storageGB: -1,
      fileUploads: true,
      realtime: true,
      analytics: true,
      adminPanel: true,
      portfolio: true,
      goals: true,
      reporting: true,
    },
    features: [
      'Everything in Business',
      'Unlimited team members',
      'Unlimited storage',
      'SSO authentication',
      'Custom domain',
      'SLA guarantee',
      'Dedicated account manager',
      'Custom integrations',
    ],
  },
};

export const getPlan = (planId) => PLANS[planId] || PLANS.free;

export const hasFeature = (user, feature) => {
  const plan = getPlan(user?.subscription?.plan || 'free');
  return plan.limits[feature] === true || plan.limits[feature] === -1;
};

export const checkLimit = (user, limitType, currentCount) => {
  const plan = getPlan(user?.subscription?.plan || 'free');
  const limit = plan.limits[limitType];
  if (limit === -1) return { allowed: true };
  if (currentCount >= limit) return { allowed: false, limit, current: currentCount };
  return { allowed: true, limit, current: currentCount };
};