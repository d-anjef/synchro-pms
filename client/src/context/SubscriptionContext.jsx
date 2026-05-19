import { createContext, useState, useEffect, useCallback } from 'react';
import { subscriptionService } from '../services/subscriptionService';
import { useAuth } from '../hooks/useAuth';

export const SubscriptionContext = createContext();

export const SubscriptionProvider = ({ children }) => {
  const { user } = useAuth();
  const [subscription, setSubscription] = useState(null);
  const [plan, setPlan] = useState(null);
  const [loading, setLoading] = useState(false);
  const [upgradeModal, setUpgradeModal] = useState({ open: false, feature: null });

  const loadSubscription = useCallback(async () => {
    if (!user) return;
    setLoading(true);
    try {
      const res = await subscriptionService.getMySubscription();
      setSubscription(res.subscription);
      setPlan(res.plan);
    } catch (err) {
      console.error('Failed to load subscription', err);
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    if (user) loadSubscription();
  }, [user, loadSubscription]);

  const hasFeature = (feature) => {
    if (!plan?.limits) return false;
    return plan.limits[feature] === true || plan.limits[feature] === -1;
  };

  const checkLimit = (limitType, current) => {
    if (!plan?.limits) return { allowed: false };
    const limit = plan.limits[limitType];
    if (limit === -1) return { allowed: true };
    return { allowed: current < limit, limit, current };
  };

  const openUpgradeModal = (feature = null) => {
    setUpgradeModal({ open: true, feature });
  };

  const closeUpgradeModal = () =>
    setUpgradeModal({ open: false, feature: null });

  return (
    <SubscriptionContext.Provider
      value={{
        subscription,
        plan,
        loading,
        loadSubscription,
        hasFeature,
        checkLimit,
        upgradeModal,
        openUpgradeModal,
        closeUpgradeModal,
      }}
    >
      {children}
    </SubscriptionContext.Provider>
  );
};