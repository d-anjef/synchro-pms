import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FiMoreHorizontal, FiMessageSquare, FiLink, FiBarChart2 } from 'react-icons/fi';
import { format } from 'date-fns';
import Avatar from '../common/Avatar';
import './TaskCard.css';

const TaskCard = ({ task, dragHandleProps }) => {
  const navigate = useNavigate();

  const progress = task.progress || 0;
  const dueDate = task.dueDate ? format(new Date(task.dueDate), 'MMM dd, yyyy') : '';

  return (
    <motion.div
      className="task-card"
      whileHover={{ y: -2 }}
      onClick={() => navigate(`/tasks/${task._id}`)}
      {...dragHandleProps}
    >
      {/* Title row */}
      <div className="task-card-top">
        <h4 className="task-card-title">{task.title}</h4>
        <button className="task-card-menu" onClick={(e) => e.stopPropagation()}>
          <FiMoreHorizontal size={14} />
        </button>
      </div>

      {/* Project + due date */}
      <div className="task-card-meta">
        <FiBarChart2 size={12} />
        <span>{dueDate}</span>
      </div>

      {/* Subtitle (project name or description) */}
      {task.project?.name && (
        <div className="task-card-subtitle">
          {task.project.name}
        </div>
      )}

      {/* Progress */}
      <div className="task-card-progress">
        <div className="task-card-progress-bar">
          <motion.div
            className="task-card-progress-fill"
            style={{ background: progress === 100 ? '#22c55e' : '#3b82f6' }}
            initial={{ width: 0 }}
            animate={{ width: `${progress}%` }}
            transition={{ duration: 0.6 }}
          />
        </div>
        <span className="task-card-progress-text">Progress : {progress}%</span>
      </div>

      {/* Footer: avatars + counts */}
      <div className="task-card-footer">
        <div className="task-card-avatars">
          {task.assignees?.slice(0, 3).map((user) => (
            <Avatar key={user._id} src={user.avatar?.url} name={user.name} size="xs" />
          ))}
          {task.assignees?.length > 3 && (
            <div className="task-card-avatar-more">+{task.assignees.length - 3}</div>
          )}
        </div>

        <div className="task-card-counts">
          <div className="task-card-count">
            <FiMessageSquare size={12} />
            <span>{task.comments?.length || 0}</span>
          </div>
          <div className="task-card-count">
            <FiLink size={12} />
            <span>{task.attachments?.length || 0}</span>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default TaskCard;