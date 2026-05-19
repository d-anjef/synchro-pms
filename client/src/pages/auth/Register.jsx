import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FiUser, FiMail, FiLock, FiEye, FiEyeOff, FiArrowRight } from 'react-icons/fi';
import toast from 'react-hot-toast';
import { useAuth } from '../../hooks/useAuth';
import Button from '../../components/common/Button';
import '../../styles/components/auth.css';

const Register = () => {
  const { register } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: '', email: '', password: '' });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (form.password.length < 6) {
      return toast.error('Password must be at least 6 characters');
    }
    setLoading(true);
    try {
      await register(form);
      toast.success('Account created! Welcome 🎉');
      navigate('/dashboard');
    } catch (err) {
      toast.error(err.message || 'Registration failed');
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
          transition={{ duration: 0.4 }}
        >
          <Link to="/" className="auth-logo">
            <div className="auth-logo-mark">S</div>
            <span className="auth-logo-text">Synchro</span>
          </Link>

          <h1 className="auth-title">Create your account</h1>
          <p className="auth-subtitle">
            Join thousands of teams already using Synchro to ship faster.
          </p>

          <form onSubmit={handleSubmit} className="auth-form">
            <div className="form-group">
              <label className="form-label">Full Name</label>
              <div className="form-input-wrapper">
                <span className="form-input-icon"><FiUser size={16} /></span>
                <input
                  type="text"
                  name="name"
                  placeholder="John Doe"
                  className="form-input"
                  value={form.name}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Email</label>
              <div className="form-input-wrapper">
                <span className="form-input-icon"><FiMail size={16} /></span>
                <input
                  type="email"
                  name="email"
                  placeholder="you@example.com"
                  className="form-input"
                  value={form.email}
                  onChange={handleChange}
                  required
                  autoComplete="email"
                />
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Password</label>
              <div className="form-input-wrapper">
                <span className="form-input-icon"><FiLock size={16} /></span>
                <input
                  type={showPassword ? 'text' : 'password'}
                  name="password"
                  placeholder="At least 6 characters"
                  className="form-input"
                  value={form.password}
                  onChange={handleChange}
                  required
                  autoComplete="new-password"
                />
                <button
                  type="button"
                  className="form-input-toggle"
                  onClick={() => setShowPassword((p) => !p)}
                >
                  {showPassword ? <FiEyeOff size={16} /> : <FiEye size={16} />}
                </button>
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
              Create account
            </Button>
          </form>

          <p className="auth-footer">
            Already have an account? <Link to="/login">Sign in</Link>
          </p>
        </motion.div>
      </div>

      <div className="auth-visual-side">
        <motion.div
          className="auth-visual-content"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <h2>Start your team's journey today</h2>
          <p>
            Get started in seconds. No credit card required. Cancel anytime.
          </p>

          <motion.div
            className="auth-floating-card"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.5 }}
          >
            <div className="auth-floating-card-title">✨ What you'll get</div>
            <div style={{ fontSize: 13, color: 'rgba(255,255,255,0.85)', lineHeight: 2 }}>
              ✓ Unlimited projects & tasks<br />
              ✓ Realtime team collaboration<br />
              ✓ Kanban, Timeline & Calendar views<br />
              ✓ File attachments up to 10MB<br />
              ✓ Beautiful analytics dashboard
            </div>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
};

export default Register;