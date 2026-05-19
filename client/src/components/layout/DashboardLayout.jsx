import { useState } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import Sidebar from './Sidebar';
import Topbar from './Topbar';
import CreateTaskModal from '../tasks/CreateTaskModal';
import TrialBanner from '../billing/TrialBanner';
import './DashboardLayout.css';

const DashboardLayout = () => {
  const [collapsed, setCollapsed] = useState(false);
  const [createTaskOpen, setCreateTaskOpen] = useState(false);
  const location = useLocation();

  return (
    <div className="dashboard-layout">
      <Sidebar
        collapsed={collapsed}
        onToggle={() => setCollapsed((c) => !c)}
        onCreateTask={() => setCreateTaskOpen(true)}
      />
      <div className="dashboard-main">
        <TrialBanner />
        <Topbar />
        <main className="dashboard-content">
          <AnimatePresence mode="wait">
            <motion.div
              key={location.pathname}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
              style={{ minHeight: '100%' }}
            >
              <Outlet />
            </motion.div>
          </AnimatePresence>
        </main>
      </div>

      <CreateTaskModal
        isOpen={createTaskOpen}
        onClose={() => setCreateTaskOpen(false)}
        onCreated={() => window.location.reload()}
      />
    </div>
  );
};

export default DashboardLayout;