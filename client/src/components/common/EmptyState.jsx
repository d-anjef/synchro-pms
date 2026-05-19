import { motion } from 'framer-motion';
import './EmptyState.css';

const EmptyState = ({ icon, title, description, action }) => (
  <motion.div
    className="empty-state"
    initial={{ opacity: 0, scale: 0.95 }}
    animate={{ opacity: 1, scale: 1 }}
  >
    {icon && <div className="empty-state-icon">{icon}</div>}
    <h3>{title}</h3>
    {description && <p>{description}</p>}
    {action && <div className="empty-state-action">{action}</div>}
  </motion.div>
);

export default EmptyState;