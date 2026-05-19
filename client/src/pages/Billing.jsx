import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FiCheck, FiClock, FiCreditCard, FiX } from 'react-icons/fi';
import toast from 'react-hot-toast';
import Loader from '../components/common/Loader';
import Button from '../components/common/Button';
import ConfirmDialog from '../components/common/ConfirmDialog';
import PricingSection from '../components/public/PricingSection';
import { useSubscription } from '../hooks/useSubscription';
import { subscriptionService } from '../services/subscriptionService';
import { paymentService } from '../services/paymentService';
import { getTrialDaysLeft } from '../utils/plans';
import { format } from 'date-fns';
import './Billing.css';

const Billing = () => {
  const { subscription, plan, loading, loadSubscription } = useSubscription();
  const [searchParams, setSearchParams] = useSearchParams();
  const [actionLoading, setActionLoading] = useState(false);
  const [payments, setPayments] = useState([]);
  const [cancelOpen, setCancelOpen] = useState(false);

  useEffect(() => {
    if (searchParams.get('success')) {
      const provider = searchParams.get('provider');
      toast.success(`🎉 Payment successful via ${provider || 'gateway'}! Subscription activated.`);
      loadSubscription();
      setSearchParams({}, { replace: true });
    }
    const errorParam = searchParams.get('error');
    if (errorParam) {
      const messages = {
        payment_failed: 'Payment failed. Please try again.',
        payment_cancelled: 'Payment was cancelled.',
        payment_not_found: 'Payment record not found.',
        invalid_response: 'Invalid payment response received.',
        server_error: 'Server error during payment verification.',
      };
      toast.error(messages[errorParam] || 'Payment error occurred');
      setSearchParams({}, { replace: true });
    }
  }, [searchParams, loadSubscription, setSearchParams]);

  useEffect(() => {
    loadPayments();
  }, []);

  const loadPayments = async () => {
    try {
      const res = await paymentService.getHistory();
      setPayments(res.payments);
    } catch (_) {}
  };

  const handleManualUpgrade = async (planId) => {
    if (!window.confirm(`Manually switch to ${planId}? (Dev mode only)`)) return;
    setActionLoading(true);
    try {
      await subscriptionService.manualUpgrade(planId);
      toast.success(`Switched to ${planId}!`);
      await loadSubscription();
      await loadPayments();
    } catch (err) {
      toast.error(err.message);
    } finally {
      setActionLoading(false);
    }
  };

  const handleCancel = async () => {
    setActionLoading(true);
    try {
      await paymentService.cancelSubscription();
      toast.success('Subscription cancelled. You\'re now on Free plan.');
      await loadSubscription();
      setCancelOpen(false);
    } catch (err) {
      toast.error(err.message);
    } finally {
      setActionLoading(false);
    }
  };

  if (loading || !subscription || !plan) return <Loader fullScreen />;

  const isTrialing = subscription.status === 'trialing';
  const trialDays = isTrialing ? getTrialDaysLeft(subscription.trialEndsAt) : 0;
  const isFree = subscription.plan === 'free';
  const isPaid = ['pro', 'business'].includes(subscription.plan);

  return (
    <div className="billing-page">
      <motion.div
        className="billing-header"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <h1>Billing & Plan</h1>
        <p>Manage your subscription and view payment history</p>
      </motion.div>

      {/* Current plan card */}
      <motion.div
        className="billing-current-card"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
      >
        <div className="billing-current-info">
          <div className="billing-current-label">Current plan</div>
          <div className="billing-current-name">
            {plan.name}
            {isTrialing && (
              <span className="billing-trial-badge">
                Trial — {trialDays} {trialDays === 1 ? 'day' : 'days'} left
              </span>
            )}
            {!isTrialing && subscription.status === 'active' && (
              <span className="billing-active-badge">Active</span>
            )}
          </div>
          <div className="billing-current-meta">
            {isFree
              ? 'Limited features. Upgrade to unlock more.'
              : isTrialing
                ? `Your trial ends on ${format(new Date(subscription.trialEndsAt), 'MMM dd, yyyy')}`
                : subscription.currentPeriodEnd
                  ? `Renews on ${format(new Date(subscription.currentPeriodEnd), 'MMM dd, yyyy')}`
                  : 'Active subscription'
            }
          </div>
        </div>
        <div className="billing-current-actions">
          {isPaid && !isTrialing && (
            <Button
              variant="outline"
              size="sm"
              icon={<FiX size={14} />}
              onClick={() => setCancelOpen(true)}
            >
              Cancel subscription
            </Button>
          )}
        </div>
      </motion.div>

      {/* Plan features */}
      <motion.div
        className="billing-features"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.15 }}
      >
        <h3>What's included in your {plan.name} plan</h3>
        <div className="billing-features-grid">
          {plan.features.map((f, i) => (
            <div key={i} className="billing-feature-item">
              <FiCheck size={14} />
              <span>{f}</span>
            </div>
          ))}
        </div>
      </motion.div>

      {/* Payment history */}
      {payments.length > 0 && (
        <motion.div
          className="billing-history"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.18 }}
        >
          <h3>Payment History</h3>
          <div className="billing-history-list">
            {payments.slice(0, 10).map((p) => (
              <div key={p._id} className="billing-history-item">
                <div className="billing-history-icon">
                  <FiCreditCard size={16} />
                </div>
                <div className="billing-history-info">
                  <div className="billing-history-title">
                    {p.planId === 'pro' ? 'Pro' : 'Business'} Plan ({p.billingCycle})
                  </div>
                  <div className="billing-history-meta">
                    {format(new Date(p.createdAt), 'MMM dd, yyyy · HH:mm')} · via {p.provider}
                  </div>
                </div>
                <div className="billing-history-right">
                  <div className="billing-history-amount">Rs. {p.amount.toLocaleString()}</div>
                  <span className={`billing-history-status status-${p.status}`}>
                    {p.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      )}

      {/* Dev mode */}
      <motion.div
        className="billing-dev-mode"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        <h4>🛠 Dev Mode — Quick switch (no payment)</h4>
        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
          {['free', 'pro', 'business'].map((p) => (
            <Button
              key={p}
              size="sm"
              variant={subscription.plan === p ? 'primary' : 'outline'}
              onClick={() => handleManualUpgrade(p)}
              disabled={subscription.plan === p || actionLoading}
            >
              {p === 'free' ? 'Free' : p === 'pro' ? 'Pro' : 'Business'}
            </Button>
          ))}
        </div>
      </motion.div>

      {/* Upgrade section */}
      <div className="billing-upgrade-section">
        <h2>Upgrade your plan</h2>
        <p>Choose a plan that fits your team's needs. Pay easily with eSewa or Khalti.</p>
        <PricingSection standalone />
      </div>

      <ConfirmDialog
        isOpen={cancelOpen}
        onClose={() => setCancelOpen(false)}
        onConfirm={handleCancel}
        title="Cancel subscription?"
        message="You'll be downgraded to the Free plan immediately. You can re-subscribe anytime."
        confirmText="Yes, cancel"
        loading={actionLoading}
      />
    </div>
  );
};

export default Billing;