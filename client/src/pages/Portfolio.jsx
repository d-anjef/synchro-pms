import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import {
  FiFolder, FiCheckCircle, FiClock, FiAlertCircle, FiUsers, FiCalendar, FiArrowRight,
} from 'react-icons/fi';
import toast from 'react-hot-toast';
import Loader from '../components/common/Loader';
import EmptyState from '../components/common/EmptyState';
import Avatar from '../components/common/Avatar';
import { projectService } from '../services/projectService';
import { formatDate } from '../utils/formatters';
import './Portfolio.css';

const Portfolio = () => {
  const navigate = useNavigate();
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    load();
  }, []);

  const load = async () => {
    try {
      const res = await projectService.getAll();
      setProjects(res.projects);
    } catch (err) {
      toast.error('Failed to load portfolio');
    } finally {
      setLoading(false);
    }
  };

  const filtered = projects.filter((p) => {
    if (filter === 'all') return true;
    return p.status === filter;
  });

  // Calculate portfolio stats
  const totalProjects = projects.length;
  const activeProjects = projects.filter((p) => p.status === 'active').length;
  const completedProjects = projects.filter((p) => p.status === 'completed').length;
  const avgProgress = totalProjects
    ? Math.round(projects.reduce((s, p) => s + (p.progress || 0), 0) / totalProjects)
    : 0;

  if (loading) return <Loader fullScreen />;

  return (
    <div className="portfolio-page">
      {/* Header */}
      <motion.div
        className="portfolio-header"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <div>
          <h1>Portfolio</h1>
          <p>High-level overview of all your projects</p>
        </div>
      </motion.div>

      {/* Overview Stats */}
      <div className="portfolio-overview">
        <motion.div className="portfolio-overview-card" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
          <div className="portfolio-overview-icon" style={{ background: '#6366f118', color: '#6366f1' }}>
            <FiFolder size={20} />
          </div>
          <div>
            <div className="portfolio-overview-value">{totalProjects}</div>
            <div className="portfolio-overview-label">Total Projects</div>
          </div>
        </motion.div>

        <motion.div className="portfolio-overview-card" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 }}>
          <div className="portfolio-overview-icon" style={{ background: '#22c55e18', color: '#22c55e' }}>
            <FiCheckCircle size={20} />
          </div>
          <div>
            <div className="portfolio-overview-value">{activeProjects}</div>
            <div className="portfolio-overview-label">Active</div>
          </div>
        </motion.div>

        <motion.div className="portfolio-overview-card" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
          <div className="portfolio-overview-icon" style={{ background: '#3b82f618', color: '#3b82f6' }}>
            <FiClock size={20} />
          </div>
          <div>
            <div className="portfolio-overview-value">{completedProjects}</div>
            <div className="portfolio-overview-label">Completed</div>
          </div>
        </motion.div>

        <motion.div className="portfolio-overview-card" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }}>
          <div className="portfolio-overview-icon" style={{ background: '#ec489918', color: '#ec4899' }}>
            <FiAlertCircle size={20} />
          </div>
          <div>
            <div className="portfolio-overview-value">{avgProgress}%</div>
            <div className="portfolio-overview-label">Avg Progress</div>
          </div>
        </motion.div>
      </div>

      {/* Filter tabs */}
      <div className="portfolio-tabs">
        {['all', 'active', 'planning', 'on_hold', 'completed'].map((f) => (
          <button
            key={f}
            className={`portfolio-tab ${filter === f ? 'active' : ''}`}
            onClick={() => setFilter(f)}
          >
            {f.replace('_', ' ').replace(/\b\w/g, (c) => c.toUpperCase())}
          </button>
        ))}
      </div>

      {/* Portfolio table */}
      {filtered.length === 0 ? (
        <EmptyState
          icon="💼"
          title="No projects in this view"
          description="Try changing the filter or create a new project."
        />
      ) : (
        <div className="portfolio-table-wrapper">
          <table className="portfolio-table">
            <thead>
              <tr>
                <th>Project</th>
                <th>Status</th>
                <th>Team</th>
                <th>Due Date</th>
                <th>Progress</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((p, i) => (
                <motion.tr
                  key={p._id}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.04 }}
                  onClick={() => navigate(`/projects/${p._id}`)}
                >
                  <td>
                    <div className="portfolio-project-cell">
                      <div
                        className="portfolio-project-icon"
                        style={{ background: `${p.color}18`, color: p.color }}
                      >
                        {p.icon || '📁'}
                      </div>
                      <div>
                        <div className="portfolio-project-name">{p.name}</div>
                        <div className="portfolio-project-desc">
                          {p.description?.slice(0, 60)}
                          {p.description?.length > 60 ? '...' : ''}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td>
                    <span className={`portfolio-status status-${p.status}`}>
                      {p.status.replace('_', ' ')}
                    </span>
                  </td>
                  <td>
                    <div className="portfolio-team">
                      {p.members?.slice(0, 4).map((m) => (
                        <Avatar key={m.user?._id} src={m.user?.avatar?.url} name={m.user?.name} size="xs" />
                      ))}
                      {p.members?.length > 4 && (
                        <span className="portfolio-team-more">+{p.members.length - 4}</span>
                      )}
                    </div>
                  </td>
                  <td>
                    {p.dueDate ? (
                      <span className="portfolio-date">
                        <FiCalendar size={12} /> {formatDate(p.dueDate)}
                      </span>
                    ) : (
                      <span style={{ color: 'var(--text-muted)', fontSize: 12 }}>—</span>
                    )}
                  </td>
                  <td>
                    <div className="portfolio-progress">
                      <div className="portfolio-progress-bar">
                        <motion.div
                          className="portfolio-progress-fill"
                          initial={{ width: 0 }}
                          animate={{ width: `${p.progress || 0}%` }}
                          transition={{ delay: 0.2 + i * 0.05, duration: 0.6 }}
                          style={{ background: p.color }}
                        />
                      </div>
                      <span>{p.progress || 0}%</span>
                    </div>
                  </td>
                  <td>
                    <button className="portfolio-go-btn">
                      <FiArrowRight size={14} />
                    </button>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default Portfolio;