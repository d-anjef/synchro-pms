import { motion } from 'framer-motion';
import {
  FiGrid, FiUsers, FiZap, FiBarChart2, FiShield, FiLayers,
} from 'react-icons/fi';
import './FeaturesSection.css';

const FEATURES = [
  {
    icon: <FiGrid />,
    color: '#6366f1',
    title: 'Beautiful Kanban Boards',
    desc: 'Drag and drop tasks between columns. Visualize your workflow with stunning, customizable boards.',
  },
  {
    icon: <FiUsers />,
    color: '#ec4899',
    title: 'Realtime Collaboration',
    desc: 'Work together in real-time. See who is online, get instant updates when teammates make changes.',
  },
  {
    icon: <FiZap />,
    color: '#f59e0b',
    title: 'Lightning Fast',
    desc: 'Optimistic UI updates and smart caching mean zero waiting. Your team stays in flow state.',
  },
  {
    icon: <FiBarChart2 />,
    color: '#22c55e',
    title: 'Powerful Analytics',
    desc: 'Track productivity, completion rates, and team performance with beautiful reports.',
  },
  {
    icon: <FiShield />,
    color: '#3b82f6',
    title: 'Enterprise Security',
    desc: 'Role-based access, encrypted data, secure file uploads. Your data is always protected.',
  },
  {
    icon: <FiLayers />,
    color: '#a855f7',
    title: 'Multiple Views',
    desc: 'Switch between Kanban, Timeline, Spreadsheet, and Calendar views. See your work your way.',
  },
];

const FeaturesSection = () => (
  <section id="features" className="features-section">
    <div className="features-container">
      <motion.div
        className="features-header"
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
      >
        <div className="section-tag">Features</div>
        <h2>Everything your team needs<br />to ship faster</h2>
        <p>
          Stop juggling 10 different tools. Synchro brings projects, tasks, files, and conversations
          together in one beautiful workspace.
        </p>
      </motion.div>

      <div className="features-grid">
        {FEATURES.map((f, i) => (
          <motion.div
            key={i}
            className="feature-card"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.08 }}
            whileHover={{ y: -4 }}
          >
            <div className="feature-card-icon" style={{ background: `${f.color}18`, color: f.color }}>
              {f.icon}
            </div>
            <h3>{f.title}</h3>
            <p>{f.desc}</p>
          </motion.div>
        ))}
      </div>
    </div>
  </section>
);

export default FeaturesSection;