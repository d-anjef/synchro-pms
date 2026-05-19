import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { FiCheckCircle, FiTrash2 } from 'react-icons/fi';
import toast from 'react-hot-toast';
import NotificationItem from '../components/notifications/NotificationItem';
import Button from '../components/common/Button';
import Loader from '../components/common/Loader';
import EmptyState from '../components/common/EmptyState';
import { useSocket } from '../hooks/useSocket';
import { notificationService } from '../services/notificationService';
import './Inbox.css';

const Inbox = () => {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    load();
  }, []);

  const load = async () => {
    try {
      const res = await notificationService.getAll();
      setNotifications(res.notifications);
    } catch (err) {
      toast.error(err.message);
    } finally {
      setLoading(false);
    }
  };

  useSocket('notification:new', (notif) => {
    setNotifications((prev) => [notif, ...prev]);
    toast.success(notif.title);
  });

  const handleMarkRead = async (id) => {
    try {
      await notificationService.markAsRead(id);
      setNotifications((prev) =>
        prev.map((n) => (n._id === id ? { ...n, isRead: true } : n))
      );
    } catch (_) {}
  };

  const handleDelete = async (id) => {
    try {
      await notificationService.delete(id);
      setNotifications((prev) => prev.filter((n) => n._id !== id));
    } catch (_) {}
  };

  const markAllRead = async () => {
    try {
      await notificationService.markAllAsRead();
      setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
      toast.success('All marked as read');
    } catch (_) {}
  };

  const clearAll = async () => {
    if (!window.confirm('Delete all notifications?')) return;
    try {
      await notificationService.clearAll();
      setNotifications([]);
      toast.success('All cleared');
    } catch (_) {}
  };

  const filtered = notifications.filter((n) => {
    if (filter === 'unread') return !n.isRead;
    if (filter === 'read') return n.isRead;
    return true;
  });

  if (loading) return <Loader fullScreen />;

  return (
    <div className="inbox-page">
      <div className="inbox-header">
        <div>
          <h1>Inbox</h1>
          <p>Stay updated with all your notifications</p>
        </div>
        <div style={{ display: 'flex', gap: 10 }}>
          <Button variant="outline" size="sm" icon={<FiCheckCircle size={14} />} onClick={markAllRead}>
            Mark all read
          </Button>
          <Button variant="outline" size="sm" icon={<FiTrash2 size={14} />} onClick={clearAll}>
            Clear all
          </Button>
        </div>
      </div>

      <div className="inbox-tabs">
        {['all', 'unread', 'read'].map((f) => (
          <button
            key={f}
            className={`inbox-tab ${filter === f ? 'active' : ''}`}
            onClick={() => setFilter(f)}
          >
            {f.charAt(0).toUpperCase() + f.slice(1)}
            {f === 'unread' && (
              <span className="inbox-tab-count">
                {notifications.filter((n) => !n.isRead).length}
              </span>
            )}
          </button>
        ))}
      </div>

      <div className="inbox-list">
        {filtered.length === 0 ? (
          <EmptyState
            icon="📬"
            title="No notifications"
            description="When you receive updates, mentions, or assignments, they'll appear here."
          />
        ) : (
          filtered.map((n, i) => (
            <NotificationItem
              key={n._id}
              notification={n}
              onMarkRead={handleMarkRead}
              onDelete={handleDelete}
              delay={i * 0.04}
            />
          ))
        )}
      </div>
    </div>
  );
};

export default Inbox;