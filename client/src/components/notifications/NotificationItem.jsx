import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { FiCheck, FiX } from 'react-icons/fi';
import Avatar from '../common/Avatar';
import { formatRelativeTime } from '../../utils/formatters';
import './NotificationItem.css';

const NotificationItem = ({ notification, onMarkRead, onDelete, delay = 0 }) => {
  const navigate = useNavigate();

  const handleClick = () => {
    if (!notification.isRead) onMarkRead?.(notification._id);
    if (notification.link) navigate(notification.link);
  };

  return (
    <motion.div
      className={`notification-item ${!notification.isRead ? 'unread' : ''}`}
      initial={{ opacity: 0, x: -10 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay }}
      onClick={handleClick}
    >
      <Avatar src={notification.sender?.avatar?.url} name={notification.sender?.name} size="md" />
      <div className="notification-body">
        <div className="notification-title">{notification.title}</div>
        <div className="notification-message">{notification.message}</div>
        <div className="notification-time">{formatRelativeTime(notification.createdAt)}</div>
      </div>
      <div className="notification-actions">
        {!notification.isRead && (
          <button onClick={(e) => { e.stopPropagation(); onMarkRead?.(notification._id); }} title="Mark as read">
            <FiCheck size={14} />
          </button>
        )}
        <button onClick={(e) => { e.stopPropagation(); onDelete?.(notification._id); }} title="Delete">
          <FiX size={14} />
        </button>
      </div>
      {!notification.isRead && <div className="notification-dot" />}
    </motion.div>
  );
};

export default NotificationItem;