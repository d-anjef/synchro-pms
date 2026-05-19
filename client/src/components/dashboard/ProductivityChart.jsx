import { motion } from 'framer-motion';
import {
  LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, Area, AreaChart,
} from 'recharts';
import { format, subDays } from 'date-fns';
import './ProductivityChart.css';

const ProductivityChart = ({ data = [] }) => {
  // Build last 7 days
  const days = Array.from({ length: 7 }, (_, i) => {
    const d = subDays(new Date(), 6 - i);
    const key = format(d, 'yyyy-MM-dd');
    const found = data.find((item) => item._id === key);
    return { day: format(d, 'EEE'), value: found?.count || 0 };
  });

  return (
    <motion.div
      className="productivity-chart"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
    >
      <div className="productivity-chart-header">
        <h3>Productivity</h3>
        <span>Tasks completed (last 7 days)</span>
      </div>
      <ResponsiveContainer width="100%" height={220}>
        <AreaChart data={days} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
          <defs>
            <linearGradient id="colorTasks" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#6366f1" stopOpacity={0.3} />
              <stop offset="95%" stopColor="#6366f1" stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="var(--border-secondary)" />
          <XAxis dataKey="day" stroke="var(--text-muted)" fontSize={11} />
          <YAxis stroke="var(--text-muted)" fontSize={11} allowDecimals={false} />
          <Tooltip
            contentStyle={{
              background: 'var(--bg-card)',
              border: '1px solid var(--border-primary)',
              borderRadius: 10,
              fontSize: 12,
            }}
          />
          <Area
            type="monotone"
            dataKey="value"
            stroke="#6366f1"
            strokeWidth={2}
            fill="url(#colorTasks)"
          />
        </AreaChart>
      </ResponsiveContainer>
    </motion.div>
  );
};

export default ProductivityChart;