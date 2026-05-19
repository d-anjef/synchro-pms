import { FiList, FiBarChart, FiGrid, FiSliders } from 'react-icons/fi';
import './ViewSwitcher.css';

const VIEWS = [
  { id: 'spreadsheet', label: 'Spreadsheet', icon: <FiList size={14} /> },
  { id: 'timeline', label: 'Timeline', icon: <FiBarChart size={14} /> },
  { id: 'kanban', label: 'Kanban', icon: <FiGrid size={14} /> },
];

const ViewSwitcher = ({ view, onChange }) => {
  return (
    <div className="view-switcher">
      {VIEWS.map((v) => (
        <button
          key={v.id}
          className={`view-switcher-btn ${view === v.id ? 'active' : ''}`}
          onClick={() => onChange(v.id)}
        >
          {v.icon}
          <span>{v.label}</span>
        </button>
      ))}
      <button className="view-switcher-filter">
        <FiSliders size={14} />
      </button>
    </div>
  );
};

export default ViewSwitcher;