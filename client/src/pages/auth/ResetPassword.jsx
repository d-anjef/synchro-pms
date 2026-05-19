import { useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FiLock, FiEye, FiEyeOff, FiArrowRight } from 'react-icons/fi';
import toast from 'react-hot-toast';
import { authService } from '../../services/authServices';
import Button from '../../components/common/Button';
import '../../styles/components/auth.css';

const ResetPassword = () => {
  const { token } = useParams();
  const navigate = useNavigate();
  const [form, setForm] = useState({ password: '', confirm: '' });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (form.password !== form.confirm) return toast.error('Passwords do not match');
    if (form.password.length < 6) return toast.error('Password must be at least 6 characters');

    setLoading(true);
    try {
      await authService.resetPassword(token, form.password);
      toast.success('Password reset successful!');
      navigate('/login');
    } catch (err) {
      toast.error(err.message || 'Failed to reset password');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-form-side">
        <motion.div className="auth-form-wrapper" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <Link to="/" className="auth-logo">
            <div className="auth-logo-mark">S</div>
            <span className="auth-logo-text">Synchro</span>
          </Link>

          <h1 className="auth-title">Set new password</h1>
          <p className="auth-subtitle">
            Create a strong password you haven't used before.
          </p>

          <form onSubmit={handleSubmit} className="auth-form">
            <div className="form-group">
              <label className="form-label">New Password</label>
              <div className="form-input-wrapper">
                <span className="form-input-icon"><FiLock size={16} /></span>
                <input
                  type={showPassword ? 'text' : 'password'}
                  placeholder="At least 6 characters"
                  className="form-input"
                  value={form.password}
                  onChange={(e) => setForm({ ...form, password: e.target.value })}
                  required
                />
                <button type="button" className="form-input-toggle" onClick={() => setShowPassword((p) => !p)}>
                  {showPassword ? <FiEyeOff size={16} /> : <FiEye size={16} />}
                </button>
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Confirm Password</label>
              <div className="form-input-wrapper">
                <span className="form-input-icon"><FiLock size={16} /></span>
                <input
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Re-enter password"
                  className="form-input"
                  value={form.confirm}
                  onChange={(e) => setForm({ ...form, confirm: e.target.value })}
                  required
                />
              </div>
            </div>

            <Button type="submit" size="lg" fullWidth loading={loading} icon={<FiArrowRight />} iconPosition="right">
              Reset password
            </Button>
          </form>

          <p className="auth-footer">
            <Link to="/login">Back to login</Link>
          </p>
        </motion.div>
      </div>

      <div className="auth-visual-side">
        <div className="auth-visual-content">
          <h2>Almost there!</h2>
          <p>Choose a strong password and you'll be back to managing your projects.</p>
        </div>
      </div>
    </div>
  );
};

export default ResetPassword;