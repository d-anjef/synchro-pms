import { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FiMail, FiArrowRight, FiArrowLeft } from 'react-icons/fi';
import toast from 'react-hot-toast';
import { authService } from '../../services/authServices';
import Button from '../../components/common/Button';
import '../../styles/components/auth.css';

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await authService.forgotPassword(email);
      setSent(true);
      toast.success('Reset link sent! Check your email 📧');
    } catch (err) {
      toast.error(err.message || 'Failed to send reset link');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-form-side">
        <motion.div
          className="auth-form-wrapper"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <Link to="/" className="auth-logo">
            <div className="auth-logo-mark">S</div>
            <span className="auth-logo-text">Synchro</span>
          </Link>

          {!sent ? (
            <>
              <h1 className="auth-title">Forgot password?</h1>
              <p className="auth-subtitle">
                Enter your email and we'll send you a link to reset your password.
              </p>

              <form onSubmit={handleSubmit} className="auth-form">
                <div className="form-group">
                  <label className="form-label">Email</label>
                  <div className="form-input-wrapper">
                    <span className="form-input-icon"><FiMail size={16} /></span>
                    <input
                      type="email"
                      placeholder="you@example.com"
                      className="form-input"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                    />
                  </div>
                </div>

                <Button
                  type="submit"
                  size="lg"
                  fullWidth
                  loading={loading}
                  icon={<FiArrowRight />}
                  iconPosition="right"
                >
                  Send reset link
                </Button>
              </form>
            </>
          ) : (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              style={{ textAlign: 'center', padding: '40px 0' }}
            >
              <div style={{ fontSize: 56, marginBottom: 16 }}>📧</div>
              <h2 className="auth-title" style={{ fontSize: 24 }}>Check your email</h2>
              <p className="auth-subtitle">
                We've sent a password reset link to <strong>{email}</strong>. It's valid for 15 minutes.
              </p>
            </motion.div>
          )}

          <p className="auth-footer">
            <Link to="/login" style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}>
              <FiArrowLeft size={14} /> Back to login
            </Link>
          </p>
        </motion.div>
      </div>

      <div className="auth-visual-side">
        <div className="auth-visual-content">
          <h2>Forgot it happens</h2>
          <p>We'll get you back into your workspace in no time. Just check your inbox.</p>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;