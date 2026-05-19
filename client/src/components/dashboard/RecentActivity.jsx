import { motion } from 'framer-motion';
import Avatar from '../common/Avatar';
import { formatRelativeTime } from '../../utils/formatters';
import './RecentActivity.css';

const RecentActivity = ({ activities = [] }) => (
  <div className="recent-activity">
    <div className="recent-activity-header">
      <h3>Recent Activity</h3>
    </div>
    <div className="recent-activity-list">
      {activities.length === 0 && (
        <div style={{ padding: 24, textAlign: 'center', color: 'var(--text-muted)', fontSize: 13 }}>
          No recent activity
        </div>
      )}
      {activities.slice(0, 8).map((a, i) => (
        <motion.div
          key={a._id}
          className="recent-activity-item"
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: i * 0.04 }}
        >
          <Avatar src={a.user?.avatar?.url} name={a.user?.name} size="sm" />
          <div className="recent-activity-text">
            <div>{a.description}</div>
            <div className="recent-activity-time">{formatRelativeTime(a.createdAt)}</div>
          </div>
        </motion.div>
      ))}
    </div>
  </div>
);

export default RecentActivity;