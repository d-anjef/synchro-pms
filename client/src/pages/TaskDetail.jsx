import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  FiCheckCircle, FiCalendar, FiUser, FiTag, FiAlertCircle,
  FiFileText, FiUserPlus, FiClock, FiMoreHorizontal, FiPlus, FiX, FiTrash2,
} from 'react-icons/fi';
import toast from 'react-hot-toast';
import Avatar from '../components/common/Avatar';
import Button from '../components/common/Button';
import Loader from '../components/common/Loader';
import ConfirmDialog from '../components/common/ConfirmDialog';
import TaskAttachments from '../components/tasks/TaskAttachments';
import TaskSubtasks from '../components/tasks/TaskSubtasks';
import TaskComments from '../components/tasks/TaskComments';
import TaskActivities from '../components/tasks/TaskActivities';
import PriorityBadge from '../components/tasks/PriorityBadge';
import StatusBadge from '../components/tasks/StatusBadge';
import { taskService } from '../services/taskService';
import { formatDate, formatRelativeTime } from '../utils/formatters';
import { TASK_STATUS_LABELS } from '../utils/constants';
import './TaskDetail.css';

const TABS = [
  { id: 'subtasks', label: 'Subtasks' },
  { id: 'comments', label: 'Comments' },
  { id: 'activities', label: 'Activities' },
];

const TaskDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [task, setTask] = useState(null);
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState('subtasks');
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    load();
  }, [id]);

  const load = async () => {
    try {
      setLoading(true);
      const res = await taskService.getById(id);
      setTask(res.task);
    } catch (err) {
      toast.error('Task not found');
      navigate('/my-tasks');
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (status) => {
    try {
      const res = await taskService.update(task._id, { status });
      setTask(res.task);
      toast.success('Status updated');
    } catch (err) {
      toast.error('Failed to update');
    }
  };

  const handleDelete = async () => {
    setDeleting(true);
    try {
      await taskService.delete(task._id);
      toast.success('Task deleted');
      navigate('/my-tasks');
    } catch (err) {
      toast.error('Failed to delete');
    } finally {
      setDeleting(false);
    }
  };

  if (loading) return <Loader fullScreen />;
  if (!task) return null;

  return (
    <motion.div
      className="task-detail-page"
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
    >
      {/* Header */}
      <div className="task-detail-header">
        <div className="task-detail-breadcrumb">
          <span onClick={() => navigate(-1)}>← Back to tasks</span>
        </div>
        <div className="task-detail-actions">
          <div className="task-detail-meta-row">
            <FiClock size={13} />
            <span>{formatRelativeTime(task.updatedAt)}</span>
          </div>
          <div className="task-detail-avatars">
            {task.assignees?.slice(0, 3).map((u) => (
              <Avatar key={u._id} src={u.avatar?.url} name={u.name} size="sm" />
            ))}
          </div>
          <Button icon={<FiUserPlus size={14} />}>New member</Button>
          <button
            className="task-detail-menu-btn"
            onClick={() => setConfirmDelete(true)}
            title="Delete task"
          >
            <FiTrash2 size={15} />
          </button>
        </div>
      </div>

      {/* Title section */}
      <div className="task-detail-title-section">
        <div className="task-detail-icon-thumb">
          {task.attachments?.[0]?.type?.startsWith('image/') ? (
            <img src={task.attachments[0].url} alt="" />
          ) : (
            <span>📋</span>
          )}
        </div>

        <h1 className="task-detail-title">
          {task.title}
          {task.priority && <PriorityBadge priority={task.priority} />}
        </h1>
      </div>

      {/* Metadata grid */}
      <div className="task-detail-metadata">
        <div className="meta-row">
          <div className="meta-label"><FiCheckCircle size={14} /> Status</div>
          <div className="meta-value">
            <select
              value={task.status}
              onChange={(e) => handleStatusChange(e.target.value)}
              className="meta-status-select"
            >
              {Object.entries(TASK_STATUS_LABELS).map(([v, l]) => (
                <option key={v} value={v}>{l}</option>
              ))}
            </select>
          </div>
        </div>

        <div className="meta-row">
          <div className="meta-label"><FiCalendar size={14} /> Due date</div>
          <div className="meta-value">
            {task.dueDate ? formatDate(task.dueDate) : '—'}
          </div>
        </div>

        <div className="meta-row">
          <div className="meta-label"><FiUser size={14} /> Assignee</div>
          <div className="meta-value">
            <div className="meta-assignees">
              {task.assignees?.length === 0 && <span style={{ color: 'var(--text-muted)' }}>Unassigned</span>}
              {task.assignees?.map((u) => (
                <span key={u._id} className="meta-chip">
                  <Avatar src={u.avatar?.url} name={u.name} size="xs" />
                  {u.name}
                  <button><FiX size={11} /></button>
                </span>
              ))}
              <button className="meta-chip-add"><FiPlus size={13} /></button>
            </div>
          </div>
        </div>

        <div className="meta-row">
          <div className="meta-label"><FiTag size={14} /> Tags</div>
          <div className="meta-value">
            {task.tags?.length === 0 && <span style={{ color: 'var(--text-muted)' }}>No tags</span>}
            {task.tags?.map((t) => (
              <span key={t} className="meta-tag">{t}</span>
            ))}
          </div>
        </div>

        <div className="meta-row">
          <div className="meta-label"><FiAlertCircle size={14} /> Priority</div>
          <div className="meta-value">
            {task.priority && <PriorityBadge priority={task.priority} />}
          </div>
        </div>

        <div className="meta-row">
          <div className="meta-label"><FiFileText size={14} /> Description</div>
          <div className="meta-value meta-description">
            {task.description || <span style={{ color: 'var(--text-muted)' }}>No description</span>}
          </div>
        </div>
      </div>

      {/* Attachments */}
      <TaskAttachments task={task} onUpdate={setTask} />

      {/* Tabs */}
      <div className="task-detail-tabs">
        {TABS.map((t) => (
          <button
            key={t.id}
            className={`task-detail-tab ${tab === t.id ? 'active' : ''}`}
            onClick={() => setTab(t.id)}
          >
            {t.label}
            {t.id === 'comments' && task.comments?.length > 0 && (
              <span className="task-detail-tab-count">{task.comments.length}</span>
            )}
          </button>
        ))}
      </div>

      {/* Tab content */}
      <div className="task-detail-tab-content">
        {tab === 'subtasks' && <TaskSubtasks task={task} onUpdate={setTask} />}
        {tab === 'comments' && <TaskComments taskId={task._id} />}
        {tab === 'activities' && <TaskActivities taskId={task._id} projectId={task.project?._id} />}
      </div>

      {/* Delete confirm */}
      <ConfirmDialog
        isOpen={confirmDelete}
        onClose={() => setConfirmDelete(false)}
        onConfirm={handleDelete}
        title="Delete this task?"
        message="This action cannot be undone. All subtasks, comments, and attachments will also be deleted."
        confirmText="Delete"
        loading={deleting}
      />
    </motion.div>
  );
};

export default TaskDetail;