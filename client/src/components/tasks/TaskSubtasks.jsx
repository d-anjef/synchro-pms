import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiCheck, FiPlus, FiX, FiCircle } from 'react-icons/fi';
import { MdDragIndicator } from 'react-icons/md';
import { taskService } from '../../services/taskService';
import toast from 'react-hot-toast';
import './TaskSubtasks.css';

const TaskSubtasks = ({ task, onUpdate }) => {
  const [newTitle, setNewTitle] = useState('');
  const [adding, setAdding] = useState(false);

  const subtasks = task.subtasks || [];
  const total = subtasks.length;
  const done = subtasks.filter((s) => s.completed).length;
  const progress = total > 0 ? Math.round((done / total) * 100) : 0;

  const handleToggle = async (subId) => {
    try {
      const res = await taskService.toggleSubtask(task._id, subId);
      onUpdate?.(res.task);
    } catch (err) {
      toast.error('Failed to update');
    }
  };

  const handleAdd = async () => {
    if (!newTitle.trim()) return;
    try {
      const res = await taskService.addSubtask(task._id, newTitle.trim());
      onUpdate?.(res.task);
      setNewTitle('');
      setAdding(false);
    } catch (err) {
      toast.error('Failed to add');
    }
  };

  const handleDelete = async (subId) => {
    try {
      const res = await taskService.deleteSubtask(task._id, subId);
      onUpdate?.(res.task);
    } catch (err) {
      toast.error('Failed to delete');
    }
  };

  return (
    <div className="task-subtasks">
      <div className="task-subtasks-header">
        <h3>Our Design Process</h3>
        <div className="task-subtasks-progress">
          <div className="task-subtasks-bar">
            <motion.div
              className="task-subtasks-bar-fill"
              style={{ background: progress === 100 ? '#22c55e' : '#3b82f6' }}
              initial={{ width: 0 }}
              animate={{ width: `${progress}%` }}
              transition={{ duration: 0.6 }}
            />
          </div>
          <span>Progress : {progress}%</span>
        </div>
      </div>

      <div className="task-subtasks-list">
        <AnimatePresence>
          {subtasks.map((sub, i) => (
            <motion.div
              key={sub._id}
              className={`task-subtask-item ${sub.completed ? 'completed' : ''}`}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 10 }}
              transition={{ delay: i * 0.03 }}
            >
              <span className="task-subtask-drag"><MdDragIndicator size={14} /></span>
              <button
                className="task-subtask-checkbox"
                onClick={() => handleToggle(sub._id)}
              >
                {sub.completed ? <FiCheck size={12} /> : <FiCircle size={14} />}
              </button>
              <div className="task-subtask-content">
                <div className="task-subtask-title">{sub.title}</div>
              </div>
              <button
                className="task-subtask-delete"
                onClick={() => handleDelete(sub._id)}
              >
                <FiX size={13} />
              </button>
            </motion.div>
          ))}
        </AnimatePresence>

        {adding ? (
          <div className="task-subtask-add-form">
            <input
              type="text"
              autoFocus
              placeholder="Subtask title..."
              value={newTitle}
              onChange={(e) => setNewTitle(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') handleAdd();
                if (e.key === 'Escape') { setAdding(false); setNewTitle(''); }
              }}
            />
            <button onClick={handleAdd}>Add</button>
            <button onClick={() => { setAdding(false); setNewTitle(''); }}>
              <FiX size={13} />
            </button>
          </div>
        ) : (
          <button className="task-subtask-add-btn" onClick={() => setAdding(true)}>
            <FiPlus size={14} /> Add subtask
          </button>
        )}
      </div>
    </div>
  );
};

export default TaskSubtasks;