import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { FiArrowRight, FiPlay, FiCheckCircle } from 'react-icons/fi';
import Button from '../common/Button';
import './HeroSection.css';

const HeroSection = () => {
  const navigate = useNavigate();

  return (
    <section className="hero-section">
      <div className="hero-container">
        <motion.div
          className="hero-badge"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <span className="hero-badge-dot" />
          New: Realtime collaboration is live
        </motion.div>

        <motion.h1
          className="hero-title"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          Manage projects with <br />
          <span className="hero-title-gradient">clarity and speed</span>
        </motion.h1>

        <motion.p
          className="hero-subtitle"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          The premium project management platform built for modern teams.
          Kanban boards, realtime collaboration, file sharing, and powerful analytics — all in one beautiful workspace.
        </motion.p>

        <motion.div
          className="hero-cta"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <Button
            size="lg"
            onClick={() => navigate('/register')}
            icon={<FiArrowRight />}
            iconPosition="right"
          >
            Start free trial
          </Button>
          <button className="hero-cta-secondary">
            <span className="hero-cta-secondary-icon"><FiPlay size={12} fill="currentColor" /></span>
            Watch demo
          </button>
        </motion.div>

        <motion.div
          className="hero-trust"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
        >
          <div className="hero-trust-item"><FiCheckCircle size={14} /> 14-day free trial</div>
          <div className="hero-trust-item"><FiCheckCircle size={14} /> No credit card required</div>
          <div className="hero-trust-item"><FiCheckCircle size={14} /> Cancel anytime</div>
        </motion.div>

        {/* Product preview */}
        <motion.div
          className="hero-preview"
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.6 }}
        >
          <div className="hero-preview-window">
            <div className="hero-preview-topbar">
              <div className="hero-preview-dots">
                <span /><span /><span />
              </div>
              <div className="hero-preview-url">synchro.app/my-tasks</div>
            </div>
            <div className="hero-preview-content">
              {/* Mini kanban mockup */}
              <div className="hero-kanban">
                {[
                  { label: 'To-do', count: 4, color: '#3b82f6', tasks: ['Create wireframe', 'User research', 'Setup CI/CD', 'Review PRs'] },
                  { label: 'In Progress', count: 3, color: '#60a5fa', tasks: ['Dashboard UI', 'API integration', 'Mobile menu'] },
                  { label: 'In Review', count: 2, color: '#facc15', tasks: ['Login flow', 'Style guide'] },
                  { label: 'Completed', count: 5, color: '#22c55e', tasks: ['Landing page', 'Auth system'] },
                ].map((col, i) => (
                  <motion.div
                    key={col.label}
                    className="hero-kanban-col"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.7 + i * 0.1 }}
                  >
                    <div className="hero-kanban-col-header">
                      <span style={{ background: `${col.color}25`, color: col.color }}>
                        {col.label} • {col.count}
                      </span>
                    </div>
                    {col.tasks.map((t, j) => (
                      <motion.div
                        key={j}
                        className="hero-kanban-card"
                        initial={{ opacity: 0, x: -8 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.8 + i * 0.1 + j * 0.05 }}
                      >
                        <div className="hero-kanban-card-title">{t}</div>
                        <div className="hero-kanban-card-bar">
                          <div style={{ width: `${30 + j * 20}%`, background: col.color }} />
                        </div>
                      </motion.div>
                    ))}
                  </motion.div>
                ))}
              </div>
            </div>
          </div>
          <div className="hero-preview-glow" />
        </motion.div>
      </div>
    </section>
  );
};

export default HeroSection;