import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import {
  FiTarget, FiPlus, FiTrendingUp, FiCheckCircle, FiClock, FiFlag,
} from 'react-icons/fi';
import toast from 'react-hot-toast';
import Loader from '../components/common/Loader';
import EmptyState from '../components/common/EmptyState';
import Button from '../components/common/Button';
import Modal from '../components/common/Modal';
import { projectService } from '../services/projectService';
import { taskService } from '../services/taskService';
import { formatDate } from '../utils/formatters';
import './Goals.css';

const Goals = () => {
  const [projects, setProjects] = useState([]);
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [view, setView] = useState('milestones');
  const [modalOpen, setModalOpen] = useState(false);

  useEffect(() => {
    load();
  }, []);

  const load = async () => {
    try {
      const [p, t] = await Promise.all([
        projectService.getAll(),
        taskService.getMyTasks(),
      ]);
      setProjects(p.projects);
      setTasks(t.tasks);
    } catch (err) {
      toast.error('Failed to load goals');
    } finally {
      setLoading(false);
    }
  };

  // Extract all milestones from projects
  const allMilestones = projects.flatMap((p) =>
    (p.milestones || []).map((m) => ({
      ...m,
      _id: m._id || `${p._id}-${m.title}`,
      project: p,
    }))
  );

  const totalMilestones = allMilestones.length;
  const completedMilestones = allMilestones.filter((m) => m.completed).length;
  const upcomingMilestones = allMilestones.filter(
    (m) => !m.completed && m.dueDate && new Date(m.dueDate) > new Date()
  ).length;

  // Personal goals (high priority active tasks)
  const personalGoals = tasks.filter(
    (t) => (t.priority === 'high' || t.priority === 'urgent') && t.status !== 'completed'
  );

  if (loading) return <Loader fullScreen />;

  return (
    <div className="goals-page">
      {/* Header */}
      <motion.div
        className="goals-header"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <div>
          <h1>Goals & Milestones</h1>
          <p>Track your objectives and key results</p>
        </div>
        <Button icon={<FiPlus />} onClick={() => setModalOpen(true)}>
          Add Goal
        </Button>
      </motion.div>

      {/* Overview stats */}
      <div className="goals-stats">
        <motion.div className="goal-stat-card" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
          <div className="goal-stat-icon" style={{ background: '#6366f118', color: '#6366f1' }}>
            <FiTarget size={20} />
          </div>
          <div>
            <div className="goal-stat-value">{totalMilestones}</div>
            <div className="goal-stat-label">Total Milestones</div>
          </div>
        </motion.div>

        <motion.div className="goal-stat-card" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 }}>
          <div className="goal-stat-icon" style={{ background: '#22c55e18', color: '#22c55e' }}>
            <FiCheckCircle size={20} />
          </div>
          <div>
            <div className="goal-stat-value">{completedMilestones}</div>
            <div className="goal-stat-label">Completed</div>
          </div>
        </motion.div>

        <motion.div className="goal-stat-card" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
          <div className="goal-stat-icon" style={{ background: '#3b82f618', color: '#3b82f6' }}>
            <FiClock size={20} />
          </div>
          <div>
            <div className="goal-stat-value">{upcomingMilestones}</div>
            <div className="goal-stat-label">Upcoming</div>
          </div>
        </motion.div>

        <motion.div className="goal-stat-card" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }}>
          <div className="goal-stat-icon" style={{ background: '#ec489918', color: '#ec4899' }}>
            <FiFlag size={20} />
          </div>
          <div>
            <div className="goal-stat-value">{personalGoals.length}</div>
            <div className="goal-stat-label">Personal Goals</div>
          </div>
        </motion.div>
      </div>

      {/* Tabs */}
      <div className="goals-tabs">
        <button className={view === 'milestones' ? 'active' : ''} onClick={() => setView('milestones')}>
          Project Milestones
        </button>
        <button className={view === 'personal' ? 'active' : ''} onClick={() => setView('personal')}>
          Personal Goals
        </button>
      </div>

      {/* Project Milestones */}
      {view === 'milestones' && (
        <>
          {projects.length === 0 ? (
            <EmptyState
              icon="🎯"
              title="No projects yet"
              description="Create a project first to start tracking milestones."
            />
          ) : (
            <div className="goals-projects">
              {projects.map((p, i) => {
                const ms = p.milestones || [];
                const completedCount = ms.filter((m) => m.completed).length;
                const percent = ms.length ? Math.round((completedCount / ms.length) * 100) : 0;

                return (
                  <motion.div
                    key={p._id}
                    className="goal-project-card"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.05 }}
                  >
                    <div className="goal-project-header">
                      <div className="goal-project-icon" style={{ background: `${p.color}18`, color: p.color }}>
                        {p.icon || '📁'}
                      </div>
                      <div className="goal-project-info">
                        <h3>{p.name}</h3>
                        <div className="goal-project-progress">
                          <div className="goal-project-progress-bar">
                            <motion.div
                              initial={{ width: 0 }}
                              animate={{ width: `${percent}%` }}
                              transition={{ duration: 0.7, delay: 0.2 + i * 0.05 }}
                              style={{ background: p.color }}
                            />
                          </div>
                          <span>{completedCount}/{ms.length} ({percent}%)</span>
                        </div>
                      </div>
                    </div>

                    {ms.length === 0 ? (
                      <div className="goal-empty">No milestones for this project yet</div>
                    ) : (
                      <div className="goal-milestones-list">
                        {ms.map((m, idx) => (
                          <motion.div
                            key={idx}
                            className={`goal-milestone-item ${m.completed ? 'completed' : ''}`}
                            initial={{ opacity: 0, x: -8 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.1 + idx * 0.03 }}
                          >
                            <div className={`goal-milestone-check ${m.completed ? 'done' : ''}`}>
                              {m.completed && <FiCheckCircle size={14} />}
                            </div>
                            <div style={{ flex: 1 }}>
                              <div className="goal-milestone-title">{m.title}</div>
                              {m.dueDate && (
                                <div className="goal-milestone-date">
                                  <FiClock size={11} /> Due {formatDate(m.dueDate)}
                                </div>
                              )}
                            </div>
                          </motion.div>
                        ))}
                      </div>
                    )}
                  </motion.div>
                );
              })}
            </div>
          )}
        </>
      )}

      {/* Personal Goals */}
      {view === 'personal' && (
        <>
          {personalGoals.length === 0 ? (
            <EmptyState
              icon="🏆"
              title="No high-priority goals"
              description="Mark tasks as 'High' or 'Urgent' priority to see them as personal goals here."
            />
          ) : (
            <div className="personal-goals-list">
              {personalGoals.map((t, i) => (
                <motion.div
                  key={t._id}
                  className="personal-goal-card"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.04 }}
                >
                  <div className="personal-goal-priority" style={{
                    background: t.priority === 'urgent' ? 'var(--priority-urgent-bg)' : 'var(--priority-high-bg)',
                    color: t.priority === 'urgent' ? 'var(--priority-urgent-text)' : 'var(--priority-high-text)',
                  }}>
                    <FiFlag size={11} /> {t.priority}
                  </div>

                  <h3>{t.title}</h3>
                  {t.description && <p>{t.description.slice(0, 100)}...</p>}

                  <div className="personal-goal-progress">
                    <div className="personal-goal-progress-bar">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${t.progress || 0}%` }}
                        transition={{ duration: 0.6 }}
                        style={{ background: '#3b82f6' }}
                      />
                    </div>
                    <span>{t.progress || 0}%</span>
                  </div>

                  <div className="personal-goal-footer">
                    <span>{t.project?.icon} {t.project?.name}</span>
                    {t.dueDate && <span>Due {formatDate(t.dueDate)}</span>}
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </>
      )}

      {/* Add Goal Modal */}
      <Modal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        title="Add Goal"
        size="sm"
      >
        <p style={{ color: 'var(--text-tertiary)', fontSize: 13.5, marginBottom: 16, lineHeight: 1.6 }}>
          💡 Goals are tracked via project <strong>milestones</strong> and high-priority <strong>tasks</strong>.
        </p>
        <p style={{ color: 'var(--text-tertiary)', fontSize: 13.5, marginBottom: 20, lineHeight: 1.6 }}>
          To add a goal:
          <br />
          • <strong>Project milestone:</strong> Open a project → edit settings → add milestone
          <br />
          • <strong>Personal goal:</strong> Create a task with priority "High" or "Urgent"
        </p>
        <Button fullWidth onClick={() => setModalOpen(false)}>Got it</Button>
      </Modal>
    </div>
  );
};

export default Goals;