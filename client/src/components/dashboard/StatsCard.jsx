import { motion } from 'framer-motion';
import './StatsCard.css';

const StatsCard = ({ icon, label, value, trend, color = '#6366f1', delay = 0 }) => (
  <motion.div
    className="stats-card"
    initial={{ opacity: 0, y: 10 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ delay }}
    whileHover={{ y: -2 }}
  >
    <div className="stats-card-top">
      <div className="stats-card-icon" style={{ background: `${color}18`, color }}>
        {icon}
      </div>
      {trend !== undefined && (
        <div className={`stats-card-trend ${trend >= 0 ? 'up' : 'down'}`}>
          {trend >= 0 ? '↑' : '↓'} {Math.abs(trend)}%
        </div>
      )}
    </div>
    <div className="stats-card-value">{value}</div>
    <div className="stats-card-label">{label}</div>
  </motion.div>
);

export default StatsCard;