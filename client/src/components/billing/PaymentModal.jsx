import { useState } from 'react';
import { motion } from 'framer-motion';
import { FiArrowRight, FiCheck } from 'react-icons/fi';
import toast from 'react-hot-toast';
import Modal from '../common/Modal';
import Button from '../common/Button';
import { paymentService } from '../../services/paymentService';
import './PaymentMethodModal.css';

const PAYMENT_METHODS = [
  {
    id: 'esewa',
    name: 'eSewa',
    description: 'Nepal\'s most popular digital wallet',
    logo: 'https://esewa.com.np/common/images/esewa_logo.png',
    color: '#60bb46',
    bgColor: '#e8f5e9',
  },
  {
    id: 'khalti',
    name: 'Khalti',
    description: 'Pay via Khalti wallet, banks, or cards',
    logo: 'https://web.khalti.com/static/img/logo1.png',
    color: '#5c2d91',
    bgColor: '#f3e8f8',
  },
];

const PaymentMethodModal = ({ isOpen, onClose, plan, billingCycle }) => {
  const [selectedMethod, setSelectedMethod] = useState('esewa');
  const [loading, setLoading] = useState(false);

  const amount = plan?.price?.[billingCycle] || 0;

  const handlePay = async () => {
    if (!plan) return;
    setLoading(true);

    try {
      if (selectedMethod === 'esewa') {
        const res = await paymentService.initiateEsewa(plan.id, billingCycle);
        submitEsewaForm(res.paymentUrl, res.formData);
      } else if (selectedMethod === 'khalti') {
        const res = await paymentService.initiateKhalti(plan.id, billingCycle);
        window.location.href = res.paymentUrl;
      }
    } catch (err) {
      toast.error(err.message || 'Failed to initiate payment');
      setLoading(false);
    }
  };

  // eSewa requires form submission to redirect with POST
  const submitEsewaForm = (url, fields) => {
    const form = document.createElement('form');
    form.method = 'POST';
    form.action = url;
    form.target = '_self';

    Object.entries(fields).forEach(([key, value]) => {
      const input = document.createElement('input');
      input.type = 'hidden';
      input.name = key;
      input.value = value;
      form.appendChild(input);
    });

    document.body.appendChild(form);
    form.submit();
  };

  if (!plan) return null;

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Choose payment method" size="md">
      <div className="payment-method-modal">
        {/* Plan summary */}
        <div className="payment-summary">
          <div>
            <div className="payment-summary-label">You're upgrading to</div>
            <div className="payment-summary-plan">{plan.name} Plan</div>
            <div className="payment-summary-cycle">
              Billed {billingCycle} • Auto-renews
            </div>
          </div>
          <div className="payment-summary-price">
            <div className="payment-summary-amount">Rs. {amount.toLocaleString()}</div>
            <div className="payment-summary-period">/{billingCycle === 'yearly' ? 'year' : 'month'}</div>
          </div>
        </div>

        {/* Payment methods */}
        <div className="payment-methods-section">
          <div className="payment-methods-title">Select payment method</div>
          <div className="payment-methods-list">
            {PAYMENT_METHODS.map((method) => (
              <motion.button
                key={method.id}
                className={`payment-method-card ${selectedMethod === method.id ? 'selected' : ''}`}
                onClick={() => setSelectedMethod(method.id)}
                whileHover={{ y: -2 }}
                whileTap={{ scale: 0.98 }}
              >
                <div className="payment-method-logo" style={{ background: method.bgColor }}>
                  <img src={method.logo} alt={method.name} onError={(e) => {
                    e.target.style.display = 'none';
                    e.target.parentElement.innerHTML = `<span style="color:${method.color};font-weight:800;font-size:18px;">${method.name}</span>`;
                  }} />
                </div>
                <div className="payment-method-info">
                  <div className="payment-method-name">{method.name}</div>
                  <div className="payment-method-desc">{method.description}</div>
                </div>
                <div className={`payment-method-check ${selectedMethod === method.id ? 'checked' : ''}`}>
                  {selectedMethod === method.id && <FiCheck size={14} />}
                </div>
              </motion.button>
            ))}
          </div>
        </div>

        {/* Test credentials info */}
        <div className="payment-test-info">
          <strong>🧪 Test mode active</strong>
          <p>
            {selectedMethod === 'esewa' && (
              <>eSewa ID: <code>9806800001</code> · Password: <code>Nepal@123</code> · MPIN: <code>1122</code> · OTP: <code>123456</code></>
            )}
            {selectedMethod === 'khalti' && (
              <>Test Phone: <code>9800000000</code> · MPIN: <code>1111</code> · OTP: <code>987654</code></>
            )}
          </p>
        </div>

        {/* Actions */}
        <div className="payment-actions">
          <Button variant="outline" onClick={onClose} disabled={loading}>
            Cancel
          </Button>
          <Button
            onClick={handlePay}
            loading={loading}
            icon={<FiArrowRight />}
            iconPosition="right"
          >
            Pay Rs. {amount.toLocaleString()}
          </Button>
        </div>

        <div className="payment-security-note">
          🔒 Your payment is secure. We never store your payment details.
        </div>
      </div>
    </Modal>
  );
};

export default PaymentMethodModal;