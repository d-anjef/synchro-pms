import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FiUserPlus, FiCalendar, FiUsers, FiTarget } from 'react-icons/fi';
import toast from 'react-hot-toast';
import Loader from '../components/common/Loader';
import Button from '../components/common/Button';
import Avatar from '../components/common/Avatar';
import KanbanBoard from '../components/tasks/KanbanBoard';
import CreateTaskModal from '../components/tasks/CreateTaskModal';
import { projectService } from '../services/projectService';
import { taskService } from '../services/taskService';
import { formatDate } from '../utils/formatters';
import './ProjectDetail.css';

const ProjectDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [project, setProject] = useState(null);
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [createOpen, setCreateOpen] = useState(false);
  const [defaultStatus, setDefaultStatus] = useState('todo');

  useEffect(() => {
    load();
  }, [id]);

  const load = async () => {
    try {
      const [p, t] = await Promise.all([
        projectService.getById(id),
        taskService.getAll({ project: id }),
      ]);
      setProject(p.project);
      setTasks(t.tasks);
    } catch (err) {
      toast.error('Project not found');
      navigate('/projects');
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = (status = 'todo') => {
    setDefaultStatus(status);
    setCreateOpen(true);
  };

  if (loading) return <Loader fullScreen />;
  if (!project) return null;

  return (
    <div className="project-detail-page">
      {/* Hero */}
      <motion.div
        className="project-hero"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <div className="project-hero-top">
          <div
            className="project-hero-icon"
            style={{ background: `${project.color}18`, color: project.color }}
          >
            {project.icon}
          </div>
          <div className="project-hero-content">
            <h1>{project.name}</h1>
            {project.description && <p>{project.description}</p>}
          </div>
          <div className="project-hero-actions">
            <Button variant="outline" icon={<FiUserPlus size={14} />}>Invite</Button>
          </div>
        </div>

        <div className="project-hero-meta">
          <div className="project-meta-item">
            <FiUsers size={14} />
            <span>{project.members?.length || 0} members</span>
          </div>
          {project.dueDate && (
            <div className="project-meta-item">
              <FiCalendar size={14} />
              <span>Due {formatDate(project.dueDate)}</span>
            </div>
          )}
          <div className="project-meta-item">
            <FiTarget size={14} />
            <span>{project.progress || 0}% complete</span>
          </div>
          <div className="project-hero-avatars">
            {project.members?.slice(0, 5).map((m) => (
              <Avatar key={m.user?._id} src={m.user?.avatar?.url} name={m.user?.name} size="sm" />
            ))}
          </div>
        </div>

        {/* progress */}
        <div className="project-hero-progress">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${project.progress}%` }}
            transition={{ duration: 0.8 }}
            style={{ background: project.color }}
          />
        </div>
      </motion.div>

      {/* Tasks Kanban */}
      <div className="project-tasks-section">
        <div className="project-section-header">
          <h2>Tasks</h2>
        </div>
        <KanbanBoard tasks={tasks} onTasksUpdate={setTasks} onCreate={handleCreate} />
      </div>

      <CreateTaskModal
        isOpen={createOpen}
        onClose={() => setCreateOpen(false)}
        onCreated={(task) => setTasks((prev) => [task, ...prev])}
        defaultStatus={defaultStatus}
        defaultProject={project._id}
      />
    </div>
  );
};

export default ProjectDetail;