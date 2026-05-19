import { PRIORITY_LABELS } from '../../utils/constants';
import './PriorityBadge.css';

const PriorityBadge = ({ priority }) => {
  if (!priority) return null;
  return (
    <span className={`priority-badge priority-${priority}`}>
      {PRIORITY_LABELS[priority]}
    </span>
  );
};

export default PriorityBadge;