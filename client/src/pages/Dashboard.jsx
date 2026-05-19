import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import {
  FiFolder, FiCheckCircle, FiClock, FiTrendingUp, FiArrowRight,
} from 'react-icons/fi';
import { useNavigate } from 'react-router-dom';
import StatsCard from '../components/dashboard/StatsCard';
import ProductivityChart from '../components/dashboard/ProductivityChart';
import RecentActivity from '../components/dashboard/RecentActivity';
import Loader from '../components/common/Loader';
import EmptyState from '../components/common/EmptyState';
import Button from '../components/common/Button';
import Avatar from '../components/common/Avatar';
import PriorityBadge from '../components/tasks/PriorityBadge';
import { analyticsService } from '../services/analyticsService';
import api from '../api/axios';
import { formatSmartDate } from '../utils/formatters';
import { useAuth } from '../hooks/useAuth';
import './Dashboard.css';

const Dashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [stats, setStats] = useState(null);
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    load();
  }, []);

  const load = async () => {
    try {
      const [s, a] = await Promise.all([
        analyticsService.getDashboard(),
        api.get('/activities/feed'),
      ]);
      setStats(s.analytics);
      setActivities(a.activities || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <Loader fullScreen />;

  return (
    <div className="dashboard-page">
      {/* Welcome */}
      <motion.div
        className="dashboard-welcome"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <div>
          <h1>Welcome back, {user?.name?.split(' ')[0]} 👋</h1>
          <p>Here's what's happening with your projects today.</p>
        </div>
      </motion.div>

      {/* Stats */}
      <div className="dashboard-stats">
        <StatsCard
          icon={<FiFolder />}
          label="Total Projects"
          value={stats?.totalProjects || 0}
          color="#6366f1"
          delay={0}
        />
        <StatsCard
          icon={<FiCheckCircle />}
          label="Total Tasks"
          value={stats?.totalTasks || 0}
          color="#22c55e"
          delay={0.05}
        />
        <StatsCard
          icon={<FiTrendingUp />}
          label="Completion Rate"
          value={`${stats?.completionRate || 0}%`}
          color="#3b82f6"
          delay={0.1}
        />
        <StatsCard
          icon={<FiClock />}
          label="Overdue Tasks"
          value={stats?.overdueTasks || 0}
          color="#ef4444"
          delay={0.15}
        />
      </div>

      {/* Main grid */}
      <div className="dashboard-grid">
        {/* Productivity */}
        <div className="dashboard-col-main">
          <ProductivityChart data={stats?.productivity || []} />

          {/* My tasks preview */}
          <div className="dashboard-my-tasks">
            <div className="dashboard-section-header">
              <h3>My Tasks</h3>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => navigate('/my-tasks')}
                icon={<FiArrowRight size={14} />}
                iconPosition="right"
              >
                View all
              </Button>
            </div>
            {stats?.myTasks?.length === 0 ? (
              <EmptyState icon="📋" title="No tasks assigned" description="When you get assigned to tasks, they'll appear here." />
            ) : (
              <div className="dashboard-tasks-list">
                {stats?.myTasks?.slice(0, 5).map((t, i) => (
                  <motion.div
                    key={t._id}
                    className="dashboard-task-row"
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.05 }}
                    onClick={() => navigate(`/tasks/${t._id}`)}
                  >
                    <div className="dashboard-task-info">
                      <div className="dashboard-task-title">{t.title}</div>
                      <div className="dashboard-task-meta">
                        {t.project?.icon} {t.project?.name}
                        {t.dueDate && <> · Due {formatSmartDate(t.dueDate)}</>}
                      </div>
                    </div>
                    {t.priority && <PriorityBadge priority={t.priority} />}
                  </motion.div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Sidebar */}
        <div className="dashboard-col-side">
          <RecentActivity activities={activities} />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;