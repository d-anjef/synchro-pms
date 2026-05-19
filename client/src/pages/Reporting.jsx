import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import {
  FiTrendingUp, FiCheckCircle, FiClock, FiAlertTriangle, FiDownload, FiCalendar,
} from 'react-icons/fi';
import {
  BarChart, Bar, PieChart, Pie, Cell, LineChart, Line,
  XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, Legend, AreaChart, Area,
} from 'recharts';
import toast from 'react-hot-toast';
import StatsCard from '../components/dashboard/StatsCard';
import Loader from '../components/common/Loader';
import Button from '../components/common/Button';
import { analyticsService } from '../services/analyticsService';
import { format, subDays } from 'date-fns';
import './Reporting.css';

const STATUS_COLORS = {
  todo: '#3b82f6',
  in_progress: '#60a5fa',
  in_review: '#facc15',
  completed: '#22c55e',
};

const PRIORITY_COLORS = {
  low: '#9ca3af',
  medium: '#60a5fa',
  high: '#fb923c',
  urgent: '#f87171',
};

const Reporting = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [range, setRange] = useState('7'); // days

  useEffect(() => {
    load();
  }, []);

  const load = async () => {
    try {
      const res = await analyticsService.getDashboard();
      setData(res.analytics);
    } catch (err) {
      toast.error('Failed to load reports');
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <Loader fullScreen />;
  if (!data) return null;

  // Format data for charts
  const statusData = (data.statusBreakdown || []).map((s) => ({
    name: s._id?.replace('_', ' '),
    value: s.count,
    color: STATUS_COLORS[s._id] || '#6366f1',
  }));

  const priorityData = (data.priorityBreakdown || []).map((p) => ({
    name: p._id,
    value: p.count,
    color: PRIORITY_COLORS[p._id] || '#6366f1',
  }));

  // Productivity data for last N days
  const days = Array.from({ length: Number(range) }, (_, i) => {
    const d = subDays(new Date(), Number(range) - 1 - i);
    const key = format(d, 'yyyy-MM-dd');
    const found = (data.productivity || []).find((p) => p._id === key);
    return {
      day: format(d, range === '7' ? 'EEE' : 'MMM dd'),
      completed: found?.count || 0,
    };
  });

  return (
    <div className="reporting-page">
      <motion.div
        className="reporting-header"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <div>
          <h1>Reporting & Analytics</h1>
          <p>Detailed insights into your productivity and team performance</p>
        </div>
        <div className="reporting-actions">
          <select
            className="reporting-range-select"
            value={range}
            onChange={(e) => setRange(e.target.value)}
          >
            <option value="7">Last 7 days</option>
            <option value="14">Last 14 days</option>
            <option value="30">Last 30 days</option>
          </select>
          <Button variant="outline" icon={<FiDownload size={14} />} size="sm">
            Export
          </Button>
        </div>
      </motion.div>

      {/* KPI Cards */}
      <div className="reporting-stats">
        <StatsCard
          icon={<FiCheckCircle />}
          label="Completed Tasks"
          value={data.completedTasks || 0}
          color="#22c55e"
          delay={0}
        />
        <StatsCard
          icon={<FiTrendingUp />}
          label="Completion Rate"
          value={`${data.completionRate || 0}%`}
          color="#3b82f6"
          delay={0.05}
        />
        <StatsCard
          icon={<FiClock />}
          label="Total Tasks"
          value={data.totalTasks || 0}
          color="#6366f1"
          delay={0.1}
        />
        <StatsCard
          icon={<FiAlertTriangle />}
          label="Overdue"
          value={data.overdueTasks || 0}
          color="#ef4444"
          delay={0.15}
        />
      </div>

      {/* Charts grid */}
      <div className="reporting-grid">
        {/* Productivity area chart */}
        <motion.div
          className="reporting-chart-card large"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <div className="reporting-chart-header">
            <div>
              <h3>Task Completion Trend</h3>
              <p>Tasks completed over the selected period</p>
            </div>
          </div>
          <ResponsiveContainer width="100%" height={280}>
            <AreaChart data={days} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
              <defs>
                <linearGradient id="completedGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#22c55e" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#22c55e" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--border-secondary)" />
              <XAxis dataKey="day" stroke="var(--text-muted)" fontSize={11} />
              <YAxis stroke="var(--text-muted)" fontSize={11} allowDecimals={false} />
              <Tooltip
                contentStyle={{
                  background: 'var(--bg-card)',
                  border: '1px solid var(--border-primary)',
                  borderRadius: 10,
                  fontSize: 12,
                  color: 'var(--text-primary)',
                }}
              />
              <Area
                type="monotone"
                dataKey="completed"
                stroke="#22c55e"
                strokeWidth={2.5}
                fill="url(#completedGradient)"
              />
            </AreaChart>
          </ResponsiveContainer>
        </motion.div>

        {/* Status breakdown pie */}
        <motion.div
          className="reporting-chart-card"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
        >
          <div className="reporting-chart-header">
            <h3>Tasks by Status</h3>
          </div>
          {statusData.length === 0 ? (
            <div className="reporting-no-data">No data available</div>
          ) : (
            <>
              <ResponsiveContainer width="100%" height={220}>
                <PieChart>
                  <Pie
                    data={statusData}
                    cx="50%"
                    cy="50%"
                    innerRadius={50}
                    outerRadius={80}
                    paddingAngle={3}
                    dataKey="value"
                  >
                    {statusData.map((entry, i) => (
                      <Cell key={i} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{
                      background: 'var(--bg-card)',
                      border: '1px solid var(--border-primary)',
                      borderRadius: 10,
                      fontSize: 12,
                    }}
                  />
                </PieChart>
              </ResponsiveContainer>
              <div className="reporting-legend">
                {statusData.map((s) => (
                  <div key={s.name} className="reporting-legend-item">
                    <span className="reporting-legend-dot" style={{ background: s.color }} />
                    <span className="reporting-legend-name">{s.name}</span>
                    <span className="reporting-legend-value">{s.value}</span>
                  </div>
                ))}
              </div>
            </>
          )}
        </motion.div>

        {/* Priority bar chart */}
        <motion.div
          className="reporting-chart-card"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <div className="reporting-chart-header">
            <h3>Tasks by Priority</h3>
          </div>
          {priorityData.length === 0 ? (
            <div className="reporting-no-data">No data available</div>
          ) : (
            <ResponsiveContainer width="100%" height={260}>
              <BarChart data={priorityData} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border-secondary)" />
                <XAxis dataKey="name" stroke="var(--text-muted)" fontSize={11} tickFormatter={(v) => v.charAt(0).toUpperCase() + v.slice(1)} />
                <YAxis stroke="var(--text-muted)" fontSize={11} allowDecimals={false} />
                <Tooltip
                  cursor={{ fill: 'var(--bg-tertiary)' }}
                  contentStyle={{
                    background: 'var(--bg-card)',
                    border: '1px solid var(--border-primary)',
                    borderRadius: 10,
                    fontSize: 12,
                  }}
                />
                <Bar dataKey="value" radius={[8, 8, 0, 0]}>
                  {priorityData.map((entry, i) => (
                    <Cell key={i} fill={entry.color} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          )}
        </motion.div>

        {/* Performance summary */}
        <motion.div
          className="reporting-chart-card full-width"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.25 }}
        >
          <div className="reporting-chart-header">
            <h3>Performance Summary</h3>
            <p>Key metrics at a glance</p>
          </div>

          <div className="reporting-summary-grid">
            <div className="reporting-summary-item">
              <div className="reporting-summary-icon" style={{ background: '#22c55e18', color: '#22c55e' }}>
                <FiCheckCircle size={20} />
              </div>
              <div>
                <div className="reporting-summary-value">{data.completedTasks}</div>
                <div className="reporting-summary-label">Tasks completed</div>
              </div>
            </div>

            <div className="reporting-summary-item">
              <div className="reporting-summary-icon" style={{ background: '#3b82f618', color: '#3b82f6' }}>
                <FiTrendingUp size={20} />
              </div>
              <div>
                <div className="reporting-summary-value">{data.completionRate}%</div>
                <div className="reporting-summary-label">Completion rate</div>
              </div>
            </div>

            <div className="reporting-summary-item">
              <div className="reporting-summary-icon" style={{ background: '#f5970018', color: '#f59700' }}>
                <FiCalendar size={20} />
              </div>
              <div>
                <div className="reporting-summary-value">{data.totalProjects}</div>
                <div className="reporting-summary-label">Active projects</div>
              </div>
            </div>

            <div className="reporting-summary-item">
              <div className="reporting-summary-icon" style={{ background: '#ef444418', color: '#ef4444' }}>
                <FiAlertTriangle size={20} />
              </div>
              <div>
                <div className="reporting-summary-value">{data.overdueTasks}</div>
                <div className="reporting-summary-label">Overdue tasks</div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Reporting;