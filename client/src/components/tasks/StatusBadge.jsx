import { TASK_STATUS_LABELS } from '../../utils/constants';
import './StatusBadge.css';

const STATUS_ICONS = {
  todo: '○',
  in_progress: '◐',
  in_review: '✦',
  completed: '✓',
};

const StatusBadge = ({ status, count }) => {
  return (
    <div className={`status-badge status-${status}`}>
      <span className="status-badge-icon">{STATUS_ICONS[status]}</span>
      <span>{TASK_STATUS_LABELS[status]}</span>
      {count !== undefined && <span className="status-badge-count">{count}</span>}
    </div>
  );
};

export default StatusBadge;