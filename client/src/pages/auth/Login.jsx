import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FiMail, FiLock, FiEye, FiEyeOff, FiArrowRight } from 'react-icons/fi';
import toast from 'react-hot-toast';
import { useAuth } from '../../hooks/useAuth';
import Button from '../../components/common/Button';
import '../../styles/components/auth.css';

const Login = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: '', password: '' });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await login(form);
      toast.success('Welcome back! 👋');
      navigate('/dashboard');
    } catch (err) {
      toast.error(err.message || 'Login failed');
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

          <h1 className="auth-title">Welcome back</h1>
          <p className="auth-subtitle">
            Sign in to continue managing your projects and tasks with your team.
          </p>

          <form onSubmit={handleSubmit} className="auth-form">
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
                  placeholder="••••••••"
                  className="form-input"
                  value={form.password}
                  onChange={handleChange}
                  required
                  autoComplete="current-password"
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

            <div className="form-options">
              <label className="form-checkbox">
                <input type="checkbox" /> Remember me
              </label>
              <Link to="/forgot-password" className="form-link">
                Forgot password?
              </Link>
            </div>

            <Button
              type="submit"
              size="lg"
              fullWidth
              loading={loading}
              icon={<FiArrowRight />}
              iconPosition="right"
            >
              Sign in
            </Button>
          </form>

          <p className="auth-footer">
            Don't have an account? <Link to="/register">Create one</Link>
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
          <h2>Manage projects with clarity & speed</h2>
          <p>
            All your projects, tasks, and team collaboration in one premium workspace built for modern teams.
          </p>

          <motion.div
            className="auth-floating-card"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.5 }}
          >
            <div className="auth-floating-card-title">📊 Today's Progress</div>
            <div className="auth-floating-card-row">
              <span className="auth-floating-card-dot" />
              <span style={{ fontSize: 13, color: 'rgba(255,255,255,0.85)' }}>12 tasks completed</span>
            </div>
            <div className="auth-floating-card-row">
              <span className="auth-floating-card-dot" style={{ background: '#facc15' }} />
              <span style={{ fontSize: 13, color: 'rgba(255,255,255,0.85)' }}>3 in review</span>
            </div>
            <div className="auth-floating-card-row">
              <span className="auth-floating-card-dot" style={{ background: '#60a5fa' }} />
              <span style={{ fontSize: 13, color: 'rgba(255,255,255,0.85)' }}>5 in progress</span>
            </div>
          </motion.div>

          <motion.div
            className="auth-floating-card"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.7 }}
          >
            <div className="auth-floating-card-title">⚡ Team Activity</div>
            <div style={{ fontSize: 13, color: 'rgba(255,255,255,0.75)', lineHeight: 1.8 }}>
              <div>• Sarah completed "Dashboard UI"</div>
              <div>• Joe started "API Integration"</div>
              <div>• Tania commented on "Login Flow"</div>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
};

export default Login;