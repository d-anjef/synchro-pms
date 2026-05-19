import { NavLink, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  FiGrid, FiFileText, FiInbox, FiBarChart2, FiFolder,
  FiUsers, FiFlag, FiPlus, FiHelpCircle, FiMoreHorizontal,
  FiChevronDown, FiSidebar, FiLogOut, FiSettings, FiCreditCard,
} from 'react-icons/fi';
import { useState } from 'react';
import { useAuth } from '../../hooks/useAuth';
import Avatar from '../common/Avatar';
import './Sidebar.css';

const Sidebar = ({ collapsed, onToggle, onCreateTask }) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [showUserMenu, setShowUserMenu] = useState(false);

  const navItems = [
    { to: '/dashboard', label: 'Dashboard', icon: <FiGrid size={17} /> },
    { to: '/my-tasks', label: 'My Task', icon: <FiFileText size={17} /> },
    { to: '/inbox', label: 'Inbox', icon: <FiInbox size={17} />, badge: 5 },
    { to: '/reporting', label: 'Reporting', icon: <FiBarChart2 size={17} /> },
    { to: '/portfolio', label: 'Portfolio', icon: <FiFolder size={17} /> },
    { to: '/accounts', label: 'Accounts', icon: <FiUsers size={17} /> },
    { to: '/goals', label: 'Goals', icon: <FiFlag size={17} /> },
  ];

  const favorites = [
    { name: 'ABC Projects - Dashboard', emoji: '📋' },
    { name: 'Kiara Projects - Website', emoji: '🌐' },
    { name: 'Dribbble Shot', emoji: '🎨' },
  ];

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  return (
    <motion.aside
      className={`sidebar ${collapsed ? 'sidebar-collapsed' : ''}`}
      initial={false}
      animate={{ width: collapsed ? 72 : 260 }}
      transition={{ duration: 0.25 }}
    >
      {/* User Profile Header */}
      <div className="sidebar-header">
        <div
          className="sidebar-user"
          onClick={() => setShowUserMenu((s) => !s)}
        >
          <Avatar src={user?.avatar?.url} name={user?.name} size="md" />
          {!collapsed && (
            <div className="sidebar-user-info">
              <div className="sidebar-user-name">{user?.name}</div>
              <div className="sidebar-user-email">{user?.email}</div>
            </div>
          )}
        </div>
        {!collapsed && (
          <button className="sidebar-toggle" onClick={onToggle}>
            <FiSidebar size={16} />
          </button>
        )}

        {/* User dropdown */}
        {showUserMenu && !collapsed && (
  <motion.div
    className="sidebar-user-menu"
    initial={{ opacity: 0, y: -8 }}
    animate={{ opacity: 1, y: 0 }}
  >
    <button onClick={() => { navigate('/profile'); setShowUserMenu(false); }}>
      <FiSettings size={14} /> Profile Settings
    </button>
    <button onClick={() => { navigate('/billing'); setShowUserMenu(false); }}>
      <FiCreditCard size={14} /> Billing & Plan
    </button>
    <button onClick={handleLogout}>
      <FiLogOut size={14} /> Logout
    </button>
  </motion.div>
)}
      </div>

      {/* Create Task Button */}
      <button className="sidebar-create-btn" onClick={onCreateTask}>
        <FiPlus size={16} />
        {!collapsed && <span>Create Task</span>}
      </button>

      {/* Navigation */}
      <nav className="sidebar-nav">
        {navItems.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            className={({ isActive }) =>
              `sidebar-nav-item ${isActive ? 'active' : ''}`
            }
          >
            <span className="sidebar-nav-icon">{item.icon}</span>
            {!collapsed && (
              <>
                <span className="sidebar-nav-label">{item.label}</span>
                {item.badge && (
                  <span className="sidebar-nav-badge">{item.badge}</span>
                )}
              </>
            )}
          </NavLink>
        ))}
      </nav>

      {/* Favourites */}
      {!collapsed && (
        <div className="sidebar-section">
          <div className="sidebar-section-header">
            <div className="sidebar-section-title">
              <FiChevronDown size={14} />
              <span>Favourite</span>
            </div>
            <div className="sidebar-section-actions">
              <button><FiMoreHorizontal size={14} /></button>
              <button><FiPlus size={14} /></button>
            </div>
          </div>
          <div className="sidebar-favorites">
            {favorites.map((fav, i) => (
              <button key={i} className="sidebar-favorite-item">
                <span className="sidebar-favorite-icon">{fav.emoji}</span>
                <span className="sidebar-favorite-name">{fav.name}</span>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Help Center */}
      <div className="sidebar-footer">
        <button className="sidebar-help">
          {!collapsed && <span>Help Center</span>}
          <FiHelpCircle size={16} />
        </button>
      </div>
    </motion.aside>
  );
};

export default Sidebar;