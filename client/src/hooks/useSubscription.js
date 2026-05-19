import { useContext } from 'react';
import { SubscriptionContext } from '../context/SubscriptionContext';

export const useSubscription = () => {
  const ctx = useContext(SubscriptionContext);
  if (!ctx) throw new Error('useSubscription must be used within SubscriptionProvider');
  return ctx;
};