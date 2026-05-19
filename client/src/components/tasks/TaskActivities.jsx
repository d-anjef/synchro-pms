import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import Avatar from '../common/Avatar';
import { formatRelativeTime } from '../../utils/formatters';
import api from '../../api/axios';
import './TaskActivities.css';

const TaskActivities = ({ taskId, projectId }) => {
  const [activities, setActivities] = useState([]);

  useEffect(() => {
    const load = async () => {
      try {
        const res = await api.get('/activities', { params: { project: projectId } });
        setActivities(res.activities || []);
      } catch (_) {}
    };
    if (projectId) load();
  }, [projectId, taskId]);

  return (
    <div className="task-activities">
      {activities.length === 0 ? (
        <div className="comments-empty">No activity yet</div>
      ) : (
        activities.slice(0, 10).map((a, i) => (
          <motion.div
            key={a._id}
            className="activity-item"
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.03 }}
          >
            <Avatar src={a.user?.avatar?.url} name={a.user?.name} size="sm" />
            <div className="activity-body">
              <div className="activity-text">{a.description}</div>
              <div className="activity-time">{formatRelativeTime(a.createdAt)}</div>
            </div>
          </motion.div>
        ))
      )}
    </div>
  );
};

export default TaskActivities;