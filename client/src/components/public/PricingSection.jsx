import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { FiCheck, FiZap } from 'react-icons/fi';
import { subscriptionService } from '../../services/subscriptionService';
import { useAuth } from '../../hooks/useAuth';
import Button from '../common/Button';
import PaymentMethodModal from '../billing/PaymentModal'
import './PricingSection.css';

const PricingSection = ({ standalone = false }) => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [cycle, setCycle] = useState('monthly');
  const [plans, setPlans] = useState({});
  const [paymentModal, setPaymentModal] = useState({ open: false, plan: null });

  useEffect(() => {
    subscriptionService.getPlans()
      .then((res) => setPlans(res.plans))
      .catch(console.error);
  }, []);

  const planOrder = ['free', 'pro', 'business', 'enterprise'];

  const handlePlanClick = (plan) => {
    if (plan.id === 'enterprise') {
      window.location.href = 'mailto:sales@synchro.com?subject=Enterprise Inquiry';
      return;
    }
    if (plan.id === 'free') {
      navigate(user ? '/dashboard' : '/register');
      return;
    }
    if (!user) {
      navigate('/register');
      return;
    }
    // Open payment method modal
    setPaymentModal({ open: true, plan });
  };

  const getPriceDisplay = (plan) => {
    if (plan.id === 'enterprise') return 'Custom';
    const price = plan.price[cycle];
    if (price === 0) return 'Free';
    const displayPrice = cycle === 'yearly' ? Math.round(price / 12) : price;
    return `Rs. ${displayPrice.toLocaleString()}`;
  };

  return (
    <section id="pricing" className={`pricing-section ${standalone ? 'standalone' : ''}`}>
      <div className="pricing-container">
        <motion.div
          className="pricing-header"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          {!standalone && <div className="section-tag">Pricing</div>}
          <h2>Simple pricing for<br />teams of all sizes</h2>
          <p>Start free, upgrade as you grow. Pay easily with eSewa or Khalti.</p>

          <div className="pricing-toggle">
            <button
              className={cycle === 'monthly' ? 'active' : ''}
              onClick={() => setCycle('monthly')}
            >
              Monthly
            </button>
            <button
              className={cycle === 'yearly' ? 'active' : ''}
              onClick={() => setCycle('yearly')}
            >
              Yearly
              <span className="pricing-toggle-save">Save 17%</span>
            </button>
          </div>
        </motion.div>

        <div className="pricing-grid">
          {planOrder.map((planId, i) => {
            const plan = plans[planId];
            if (!plan) return null;
            return (
              <motion.div
                key={planId}
                className={`pricing-card ${plan.popular ? 'popular' : ''}`}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.08 }}
              >
                {plan.popular && (
                  <div className="pricing-card-badge">
                    <FiZap size={11} fill="currentColor" /> Most popular
                  </div>
                )}
                <div className="pricing-card-name">{plan.name}</div>
                <div className="pricing-card-price">
                  <span className="pricing-card-amount">{getPriceDisplay(plan)}</span>
                  {plan.id !== 'enterprise' && plan.price[cycle] !== 0 && (
                    <span className="pricing-card-period">/month</span>
                  )}
                </div>
                {plan.id !== 'free' && plan.id !== 'enterprise' && cycle === 'yearly' && (
                  <div className="pricing-card-billed">
                    Billed Rs. {plan.price.yearly.toLocaleString()}/year
                  </div>
                )}

                <Button
                  variant={plan.popular ? 'primary' : 'outline'}
                  fullWidth
                  size="md"
                  onClick={() => handlePlanClick(plan)}
                  style={{ marginTop: 20 }}
                >
                  {plan.id === 'free' && 'Get started'}
                  {plan.id === 'pro' && 'Start free trial'}
                  {plan.id === 'business' && 'Upgrade'}
                  {plan.id === 'enterprise' && 'Contact sales'}
                </Button>

                <div className="pricing-card-features">
                  {plan.features.map((f, j) => (
                    <div key={j} className="pricing-card-feature">
                      <FiCheck size={14} />
                      <span>{f}</span>
                    </div>
                  ))}
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Payment trust badges */}
        <motion.div
          className="pricing-trust"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
        >
          <div className="pricing-trust-label">Trusted Nepali payment partners</div>
          <div className="pricing-trust-logos">
            <div className="pricing-trust-badge">eSewa</div>
            <div className="pricing-trust-badge khalti">Khalti</div>
          </div>
        </motion.div>
      </div>

      {/* Payment Method Modal */}
      <PaymentMethodModal
        isOpen={paymentModal.open}
        onClose={() => setPaymentModal({ open: false, plan: null })}
        plan={paymentModal.plan}
        billingCycle={cycle}
      />
    </section>
  );
};

export default PricingSection;