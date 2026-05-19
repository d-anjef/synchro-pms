import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { FiUserPlus, FiClock, FiMoreHorizontal } from 'react-icons/fi';
import toast from 'react-hot-toast';
import TaskCalendar from '../components/tasks/TaskCalendar';
import KanbanBoard from '../components/tasks/KanbanBoard';
import ViewSwitcher from '../components/tasks/ViewSwitcher';
import CreateTaskModal from '../components/tasks/CreateTaskModal';
import Avatar from '../components/common/Avatar';
import Button from '../components/common/Button';
import Loader from '../components/common/Loader';
import { taskService } from '../services/taskService';
import { userService } from '../services/userService';
import { useAuth } from '../hooks/useAuth';
import { useSocket } from '../hooks/useSocket';
import './MyTasks.css';

const MyTasks = () => {
  const { user } = useAuth();
  const [tasks, setTasks] = useState([]);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [view, setView] = useState('kanban');
  const [createOpen, setCreateOpen] = useState(false);
  const [defaultStatus, setDefaultStatus] = useState('todo');

  useEffect(() => {
    loadTasks();
    loadUsers();
  }, []);

  // Realtime updates
  useSocket('task:created', (task) => {
    const assigneeIds = (task.assignees || []).map((a) => a._id || a);
    if (assigneeIds.includes(user?._id)) {
      setTasks((prev) => {
        if (prev.find((t) => t._id === task._id)) return prev;
        return [task, ...prev];
      });
    }
  }, [user?._id]);

  useSocket('task:updated', (task) => {
    setTasks((prev) => prev.map((t) => (t._id === task._id ? task : t)));
  });

  useSocket('task:status_changed', (task) => {
    setTasks((prev) => prev.map((t) => (t._id === task._id ? task : t)));
  });

  useSocket('task:deleted', ({ id }) => {
    setTasks((prev) => prev.filter((t) => t._id !== id));
  });

  const loadTasks = async () => {
    try {
      setLoading(true);
      const res = await taskService.getMyTasks();
      setTasks(res.tasks);
    } catch (err) {
      toast.error(err.message || 'Failed to load tasks');
    } finally {
      setLoading(false);
    }
  };

  const loadUsers = async () => {
    try {
      const res = await userService.getAll();
      setUsers(res.users.slice(0, 5));
    } catch (_) {}
  };

  const handleCreate = (status = 'todo') => {
    setDefaultStatus(status);
    setCreateOpen(true);
  };

  const handleCreated = (task) => {
    setTasks((prev) => [task, ...prev]);
  };

  if (loading) return <Loader fullScreen />;

  return (
    <div className="my-tasks-page">
      {/* Page header */}
      <div className="my-tasks-header">
        <h1 className="my-tasks-title">My Task</h1>

        <div className="my-tasks-actions">
          <div className="my-tasks-status">
            <FiClock size={13} />
            <span>3 min ago</span>
          </div>
          <div className="my-tasks-online">
            {users.slice(0, 3).map((u) => (
              <Avatar
                key={u._id}
                src={u.avatar?.url}
                name={u.name}
                size="sm"
                status={u.isOnline ? 'online' : ''}
              />
            ))}
            {users.length > 3 && (
              <div className="my-tasks-online-more">+{users.length - 3}</div>
            )}
          </div>
          <Button icon={<FiUserPlus size={14} />}>Invite</Button>
          <button className="my-tasks-menu">
            <FiMoreHorizontal size={16} />
          </button>
        </div>
      </div>

      {/* Task Calendar */}
      <TaskCalendar tasks={tasks} />

      {/* All Task section */}
      <motion.div
        className="all-tasks-section"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
      >
        <div className="all-tasks-header">
          <h2>All Task</h2>
          <ViewSwitcher view={view} onChange={setView} />
        </div>

        {view === 'kanban' && (
          <KanbanBoard
            tasks={tasks}
            onTasksUpdate={setTasks}
            onCreate={handleCreate}
          />
        )}

        {view === 'spreadsheet' && (
          <div className="placeholder-view">📋 Spreadsheet view coming soon</div>
        )}

        {view === 'timeline' && (
          <div className="placeholder-view">📊 Timeline view coming soon</div>
        )}
      </motion.div>

      {/* Create modal */}
      <CreateTaskModal
        isOpen={createOpen}
        onClose={() => setCreateOpen(false)}
        onCreated={handleCreated}
        defaultStatus={defaultStatus}
      />
    </div>
  );
};

export default MyTasks;