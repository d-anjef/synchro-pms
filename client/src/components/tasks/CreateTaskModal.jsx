import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  FiCalendar, FiUser, FiTag, FiAlertCircle, FiFileText, FiPlus, FiX, FiCheckCircle,
} from 'react-icons/fi';
import toast from 'react-hot-toast';
import Modal from '../common/Modal';
import Button from '../common/Button';
import Avatar from '../common/Avatar';
import { taskService } from '../../services/taskService';
import { projectService } from '../../services/projectService';
import { userService } from '../../services/userService';
import './CreateTaskModal.css';

const STATUSES = [
  { value: 'todo', label: 'To-do' },
  { value: 'in_progress', label: 'On Progress' },
  { value: 'in_review', label: 'In Review' },
  { value: 'completed', label: 'Completed' },
];

const PRIORITIES = [
  { value: 'low', label: 'Low' },
  { value: 'medium', label: 'Medium' },
  { value: 'high', label: 'High' },
  { value: 'urgent', label: 'Urgent' },
];

const CreateTaskModal = ({ isOpen, onClose, onCreated, defaultStatus = 'todo', defaultProject }) => {
  const [projects, setProjects] = useState([]);
  const [users, setUsers] = useState([]);
  const [showAssigneeDropdown, setShowAssigneeDropdown] = useState(false);

  const [form, setForm] = useState({
    title: '',
    description: '',
    project: defaultProject || '',
    status: defaultStatus,
    priority: 'medium',
    dueDate: '',
    assignees: [],
    tags: [],
  });
  const [tagInput, setTagInput] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isOpen) {
      loadProjects();
      loadUsers();
      setForm((f) => ({ ...f, status: defaultStatus, project: defaultProject || f.project }));
    }
  }, [isOpen, defaultStatus, defaultProject]);

  const loadProjects = async () => {
    try {
      const res = await projectService.getAll();
      setProjects(res.projects);
      if (!form.project && res.projects.length > 0) {
        setForm((f) => ({ ...f, project: res.projects[0]._id }));
      }
    } catch (err) {
      console.error(err);
    }
  };

  const loadUsers = async () => {
    try {
      const res = await userService.getAll();
      setUsers(res.users);
    } catch (err) {
      console.error(err);
    }
  };

  const toggleAssignee = (user) => {
    setForm((f) => {
      const exists = f.assignees.find((a) => a._id === user._id);
      return {
        ...f,
        assignees: exists
          ? f.assignees.filter((a) => a._id !== user._id)
          : [...f.assignees, user],
      };
    });
  };

  const addTag = () => {
    if (tagInput.trim() && !form.tags.includes(tagInput.trim())) {
      setForm((f) => ({ ...f, tags: [...f.tags, tagInput.trim()] }));
      setTagInput('');
    }
  };

  const removeTag = (tag) => {
    setForm((f) => ({ ...f, tags: f.tags.filter((t) => t !== tag) }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.title.trim()) return toast.error('Title is required');
    if (!form.project) return toast.error('Please select a project');

    setLoading(true);
    try {
      const payload = {
        ...form,
        assignees: form.assignees.map((a) => a._id),
        dueDate: form.dueDate || undefined,
      };
      const res = await taskService.create(payload);
      toast.success('Task created!');
      onCreated?.(res.task);
      onClose();
      setForm({
        title: '', description: '', project: defaultProject || '',
        status: 'todo', priority: 'medium', dueDate: '', assignees: [], tags: [],
      });
    } catch (err) {
      toast.error(err.message || 'Failed to create task');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Create Task" size="lg">
      <form onSubmit={handleSubmit} className="create-task-form">
        {/* Title */}
        <div className="ct-row">
          <input
            type="text"
            placeholder="Task title..."
            className="ct-title-input"
            value={form.title}
            onChange={(e) => setForm({ ...form, title: e.target.value })}
            autoFocus
          />
        </div>

        {/* Project */}
        <div className="ct-row">
          <label className="ct-label">
            <FiCheckCircle size={15} /> Project
          </label>
          <select
            className="ct-select"
            value={form.project}
            onChange={(e) => setForm({ ...form, project: e.target.value })}
          >
            <option value="">Select project...</option>
            {projects.map((p) => (
              <option key={p._id} value={p._id}>{p.icon} {p.name}</option>
            ))}
          </select>
        </div>

        {/* Status */}
        <div className="ct-row">
          <label className="ct-label">
            <FiCheckCircle size={15} /> Status
          </label>
          <div className="ct-status-pill">
            <span className={`ct-status-dot status-dot-${form.status}`} />
            <select
              className="ct-status-select"
              value={form.status}
              onChange={(e) => setForm({ ...form, status: e.target.value })}
            >
              {STATUSES.map((s) => (
                <option key={s.value} value={s.value}>{s.label}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Due date */}
        <div className="ct-row">
          <label className="ct-label">
            <FiCalendar size={15} /> Due date
          </label>
          <input
            type="date"
            className="ct-input"
            value={form.dueDate}
            onChange={(e) => setForm({ ...form, dueDate: e.target.value })}
          />
        </div>

        {/* Assignees */}
        <div className="ct-row ct-row-relative">
          <label className="ct-label">
            <FiUser size={15} /> Assignee
          </label>
          <div className="ct-assignees">
            {form.assignees.map((u) => (
              <span key={u._id} className="ct-assignee-chip">
                <Avatar src={u.avatar?.url} name={u.name} size="xs" />
                {u.name}
                <button type="button" onClick={() => toggleAssignee(u)}>
                  <FiX size={12} />
                </button>
              </span>
            ))}
            <button
              type="button"
              className="ct-assignee-add"
              onClick={() => setShowAssigneeDropdown((s) => !s)}
            >
              <FiPlus size={14} />
            </button>

            {showAssigneeDropdown && (
              <motion.div
                className="ct-assignee-dropdown"
                initial={{ opacity: 0, y: 4 }}
                animate={{ opacity: 1, y: 0 }}
              >
                {users.length === 0 && (
                  <div style={{ padding: 12, fontSize: 12, color: 'var(--text-muted)' }}>No users found</div>
                )}
                {users.map((u) => {
                  const selected = form.assignees.find((a) => a._id === u._id);
                  return (
                    <button
                      key={u._id}
                      type="button"
                      className={`ct-assignee-option ${selected ? 'selected' : ''}`}
                      onClick={() => toggleAssignee(u)}
                    >
                      <Avatar src={u.avatar?.url} name={u.name} size="sm" />
                      <div>
                        <div className="ct-assignee-name">{u.name}</div>
                        <div className="ct-assignee-email">{u.email}</div>
                      </div>
                      {selected && <FiCheckCircle size={14} color="#22c55e" style={{ marginLeft: 'auto' }} />}
                    </button>
                  );
                })}
              </motion.div>
            )}
          </div>
        </div>

        {/* Tags */}
        <div className="ct-row">
          <label className="ct-label">
            <FiTag size={15} /> Tags
          </label>
          <div className="ct-tags">
            {form.tags.map((tag) => (
              <span key={tag} className="ct-tag">
                {tag}
                <button type="button" onClick={() => removeTag(tag)}>
                  <FiX size={11} />
                </button>
              </span>
            ))}
            <input
              type="text"
              placeholder="Add tag..."
              className="ct-tag-input"
              value={tagInput}
              onChange={(e) => setTagInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  e.preventDefault();
                  addTag();
                }
              }}
            />
          </div>
        </div>

        {/* Priority */}
        <div className="ct-row">
          <label className="ct-label">
            <FiAlertCircle size={15} /> Priority
          </label>
          <div className="ct-priority-options">
            {PRIORITIES.map((p) => (
              <button
                key={p.value}
                type="button"
                className={`ct-priority-pill priority-${p.value} ${form.priority === p.value ? 'active' : ''}`}
                onClick={() => setForm({ ...form, priority: p.value })}
              >
                {p.label}
              </button>
            ))}
          </div>
        </div>

        {/* Description */}
        <div className="ct-row">
          <label className="ct-label">
            <FiFileText size={15} /> Description
          </label>
          <textarea
            placeholder="Description"
            className="ct-textarea"
            rows={3}
            value={form.description}
            onChange={(e) => setForm({ ...form, description: e.target.value })}
          />
        </div>

        {/* Footer actions */}
        <div className="ct-footer">
          <Button variant="outline" type="button" onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit" loading={loading}>
            Save Task
          </Button>
        </div>
      </form>
    </Modal>
  );
};

export default CreateTaskModal;