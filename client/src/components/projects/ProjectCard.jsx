import { motion } from 'framer-motion';
import { FiMoreHorizontal, FiUsers, FiCheckCircle } from 'react-icons/fi';
import { useNavigate } from 'react-router-dom';
import Avatar from '../common/Avatar';
import './ProjectCard.css';

const ProjectCard = ({ project, delay = 0 }) => {
  const navigate = useNavigate();

  return (
    <motion.div
      className="project-card"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay }}
      whileHover={{ y: -3 }}
      onClick={() => navigate(`/projects/${project._id}`)}
    >
      <div className="project-card-header">
        <div className="project-card-icon" style={{ background: `${project.color}18`, color: project.color }}>
          {project.icon || '📁'}
        </div>
        <button className="project-card-menu" onClick={(e) => e.stopPropagation()}>
          <FiMoreHorizontal size={16} />
        </button>
      </div>

      <h3 className="project-card-title">{project.name}</h3>
      {project.description && (
        <p className="project-card-desc">{project.description}</p>
      )}

      <div className="project-card-progress">
        <div className="project-card-progress-bar">
          <motion.div
            className="project-card-progress-fill"
            initial={{ width: 0 }}
            animate={{ width: `${project.progress || 0}%` }}
            transition={{ duration: 0.7, delay: delay + 0.2 }}
            style={{ background: project.color }}
          />
        </div>
        <span>{project.progress || 0}%</span>
      </div>

      <div className="project-card-footer">
        <div className="project-card-members">
          {project.members?.slice(0, 4).map((m) => (
            <Avatar key={m.user?._id} src={m.user?.avatar?.url} name={m.user?.name} size="xs" />
          ))}
          {project.members?.length > 4 && (
            <div className="project-card-more">+{project.members.length - 4}</div>
          )}
        </div>
        <div className={`project-card-status status-${project.status}`}>
          {project.status.replace('_', ' ')}
        </div>
      </div>
    </motion.div>
  );
};

export default ProjectCard;