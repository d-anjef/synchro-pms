import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FiZap, FiX } from 'react-icons/fi';
import { useSubscription } from '../../hooks/useSubscription';
import { getTrialDaysLeft } from '../../utils/plans';
import { useState } from 'react';
import './TrialBanner.css';

const TrialBanner = () => {
  const { subscription } = useSubscription();
  const navigate = useNavigate();
  const [dismissed, setDismissed] = useState(false);

  if (
    !subscription ||
    subscription.status !== 'trialing' ||
    !subscription.trialEndsAt ||
    dismissed
  ) return null;

  const daysLeft = getTrialDaysLeft(subscription.trialEndsAt);
  if (daysLeft <= 0) return null;

  return (
    <motion.div
      className="trial-banner"
      initial={{ y: -40, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
    >
      <div className="trial-banner-content">
        <FiZap size={14} />
        <span>
          You're on a Pro trial — <strong>{daysLeft} {daysLeft === 1 ? 'day' : 'days'} left</strong>
        </span>
        <button className="trial-banner-cta" onClick={() => navigate('/billing')}>
          Upgrade now
        </button>
      </div>
      <button className="trial-banner-close" onClick={() => setDismissed(true)}>
        <FiX size={14} />
      </button>
    </motion.div>
  );
};

export default TrialBanner;