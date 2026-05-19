import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiSend } from 'react-icons/fi';
import toast from 'react-hot-toast';
import Avatar from '../common/Avatar';
import { useAuth } from '../../hooks/useAuth';
import { useSocket } from '../../hooks/useSocket';
import { commentService } from '../../services/commentService';
import { formatRelativeTime } from '../../utils/formatters';
import { getSocket } from '../../api/socket';
import './TaskComments.css';

const TaskComments = ({ taskId }) => {
  const { user } = useAuth();
  const [comments, setComments] = useState([]);
  const [content, setContent] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    load();
    // join task room
    const socket = getSocket();
    if (socket) socket.emit('task:join', taskId);
    return () => {
      if (socket) socket.emit('task:leave', taskId);
    };
  }, [taskId]);

  const load = async () => {
    try {
      const res = await commentService.getByTask(taskId);
      setComments(res.comments);
    } catch (err) {
      console.error(err);
    }
  };

  // Realtime new comments
  useSocket('comment:new', (comment) => {
    setComments((prev) => {
      if (prev.find((c) => c._id === comment._id)) return prev;
      return [...prev, comment];
    });
  }, [taskId]);

  useSocket('comment:deleted', ({ id }) => {
    setComments((prev) => prev.filter((c) => c._id !== id));
  }, [taskId]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!content.trim()) return;
    setLoading(true);
    try {
      await commentService.create({ content: content.trim(), task: taskId });
      setContent('');
    } catch (err) {
      toast.error(err.message || 'Failed to comment');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="task-comments">
      <div className="task-comments-list">
        <AnimatePresence>
          {comments.map((c, i) => (
            <motion.div
              key={c._id}
              className="comment-item"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              transition={{ delay: i * 0.04 }}
            >
              <Avatar src={c.author?.avatar?.url} name={c.author?.name} size="sm" />
              <div className="comment-body">
                <div className="comment-header">
                  <span className="comment-author">{c.author?.name}</span>
                  <span className="comment-time">{formatRelativeTime(c.createdAt)}</span>
                </div>
                <div className="comment-text">{c.content}</div>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>

        {comments.length === 0 && (
          <div className="comments-empty">No comments yet. Be the first!</div>
        )}
      </div>

      <form onSubmit={handleSubmit} className="comment-input-row">
        <Avatar src={user?.avatar?.url} name={user?.name} size="sm" />
        <div className="comment-input-wrapper">
          <input
            type="text"
            placeholder="Add a comment..."
            value={content}
            onChange={(e) => setContent(e.target.value)}
          />
          <button type="submit" disabled={loading || !content.trim()}>
            <FiSend size={15} />
          </button>
        </div>
      </form>
    </div>
  );
};

export default TaskComments;