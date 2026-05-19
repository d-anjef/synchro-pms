import { useState, useEffect, useRef } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  FiSearch, FiShare2, FiBell, FiMoon, FiSun,
  FiCheckCircle, FiFolder, FiArrowRight, FiX,
} from 'react-icons/fi';
import toast from 'react-hot-toast';
import { useTheme } from '../../hooks/useTheme';
import { useSocket } from '../../hooks/useSocket';
import Avatar from '../common/Avatar';
import { taskService } from '../../services/taskService';
import { projectService } from '../../services/projectService';
import { notificationService } from '../../services/notificationService';
import { formatRelativeTime } from '../../utils/formatters';
import { debounce } from '../../utils/helpers';
import './Topbar.css';

// Smart breadcrumb based on route
const getBreadcrumb = (pathname) => {
  const segments = pathname.split('/').filter(Boolean);
  const map = {
    dashboard: 'Dashboard',
    'my-tasks': 'My Task',
    projects: 'Projects',
    tasks: 'Task',
    inbox: 'Inbox',
    reporting: 'Reporting',
    portfolio: 'Portfolio',
    accounts: 'Accounts',
    goals: 'Goals',
    profile: 'Profile',
    admin: 'Admin',
  };
  if (segments.length === 0) return [{ label: 'Synchro' }];
  const main = map[segments[0]] || segments[0];
  return [{ label: 'Synchro', link: '/dashboard' }, { label: main }];
};

const Topbar = () => {
  const { theme, toggleTheme } = useTheme();
  const navigate = useNavigate();
  const location = useLocation();
  const breadcrumbs = getBreadcrumb(location.pathname);

  const [search, setSearch] = useState('');
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchResults, setSearchResults] = useState({ tasks: [], projects: [] });
  const [searching, setSearching] = useState(false);
  const searchRef = useRef(null);

  const [notifOpen, setNotifOpen] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const notifRef = useRef(null);

  // ===== Search =====
  useEffect(() => {
    if (!search.trim()) {
      setSearchResults({ tasks: [], projects: [] });
      return;
    }

    const doSearch = debounce(async (q) => {
      setSearching(true);
      try {
        const [t, p] = await Promise.all([
          taskService.getAll({ search: q }),
          projectService.getAll({ search: q }),
        ]);
        setSearchResults({
          tasks: (t.tasks || []).slice(0, 5),
          projects: (p.projects || []).slice(0, 3),
        });
      } catch (_) {
      } finally {
        setSearching(false);
      }
    }, 350);

    doSearch(search);
  }, [search]);

  // ===== Load Notifications =====
  const loadNotifications = async () => {
    try {
      const res = await notificationService.getAll({ limit: 8 });
      setNotifications(res.notifications);
      setUnreadCount(res.unreadCount);
    } catch (_) {}
  };

  useEffect(() => {
    loadNotifications();
  }, []);

  // Realtime — incoming notifications
  useSocket('notification:new', (notif) => {
    setNotifications((prev) => [notif, ...prev].slice(0, 8));
    setUnreadCount((c) => c + 1);
    toast.success(notif.title, { icon: '🔔' });
  });

  // ===== Close dropdowns on outside click =====
  useEffect(() => {
    const handleClick = (e) => {
      if (searchRef.current && !searchRef.current.contains(e.target)) {
        setSearchOpen(false);
      }
      if (notifRef.current && !notifRef.current.contains(e.target)) {
        setNotifOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, []);

  // ===== Handlers =====
  const handleShare = async () => {
    const url = `${window.location.origin}/register`;
    try {
      if (navigator.share) {
        await navigator.share({
          title: 'Join my workspace on Synchro',
          text: 'Collaborate with me on Synchro PMS',
          url,
        });
      } else {
        await navigator.clipboard.writeText(url);
        toast.success('Invite link copied to clipboard! 🔗');
      }
    } catch (err) {
      // user cancelled — silent
    }
  };

  const handleNotifClick = async (notif) => {
    if (!notif.isRead) {
      try {
        await notificationService.markAsRead(notif._id);
        setNotifications((prev) =>
          prev.map((n) => (n._id === notif._id ? { ...n, isRead: true } : n))
        );
        setUnreadCount((c) => Math.max(0, c - 1));
      } catch (_) {}
    }
    if (notif.link) navigate(notif.link);
    setNotifOpen(false);
  };

  const handleMarkAllRead = async () => {
    try {
      await notificationService.markAllAsRead();
      setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
      setUnreadCount(0);
      toast.success('All marked as read');
    } catch (_) {}
  };

  const handleSearchResultClick = (path) => {
    setSearch('');
    setSearchOpen(false);
    navigate(path);
  };

  return (
    <header className="topbar">
      {/* Breadcrumb */}
      <div className="topbar-left">
        <nav className="topbar-breadcrumb">
          {breadcrumbs.map((crumb, i) => (
            <div key={i} className="topbar-breadcrumb-segment">
              {i > 0 && <span className="topbar-breadcrumb-separator">›</span>}
              {crumb.link ? (
                <Link to={crumb.link} className="topbar-breadcrumb-item">
                  {crumb.label}
                </Link>
              ) : (
                <span className={`topbar-breadcrumb-item ${i === breadcrumbs.length - 1 ? 'active' : ''}`}>
                  {crumb.label}
                </span>
              )}
            </div>
          ))}
        </nav>
      </div>

      {/* Right side */}
      <div className="topbar-right">
        {/* Search with dropdown */}
        <div className="topbar-search-wrapper" ref={searchRef}>
          <div className={`topbar-search ${searchOpen ? 'focused' : ''}`}>
            <FiSearch size={15} />
            <input
              type="text"
              placeholder="Search tasks, projects..."
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setSearchOpen(true);
              }}
              onFocus={() => setSearchOpen(true)}
            />
            {search && (
              <button
                className="topbar-search-clear"
                onClick={() => {
                  setSearch('');
                  setSearchResults({ tasks: [], projects: [] });
                }}
              >
                <FiX size={14} />
              </button>
            )}
          </div>

          <AnimatePresence>
            {searchOpen && search && (
              <motion.div
                className="topbar-search-dropdown"
                initial={{ opacity: 0, y: -8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
              >
                {searching ? (
                  <div className="topbar-search-empty">Searching...</div>
                ) : searchResults.tasks.length === 0 && searchResults.projects.length === 0 ? (
                  <div className="topbar-search-empty">No results for "{search}"</div>
                ) : (
                  <>
                    {searchResults.tasks.length > 0 && (
                      <div className="topbar-search-section">
                        <div className="topbar-search-label">Tasks</div>
                        {searchResults.tasks.map((t) => (
                          <button
                            key={t._id}
                            className="topbar-search-result"
                            onClick={() => handleSearchResultClick(`/tasks/${t._id}`)}
                          >
                            <FiCheckCircle size={14} color="var(--text-tertiary)" />
                            <div className="topbar-search-result-info">
                              <div className="topbar-search-result-title">{t.title}</div>
                              <div className="topbar-search-result-sub">
                                {t.project?.icon} {t.project?.name}
                              </div>
                            </div>
                            <FiArrowRight size={12} color="var(--text-muted)" />
                          </button>
                        ))}
                      </div>
                    )}

                    {searchResults.projects.length > 0 && (
                      <div className="topbar-search-section">
                        <div className="topbar-search-label">Projects</div>
                        {searchResults.projects.map((p) => (
                          <button
                            key={p._id}
                            className="topbar-search-result"
                            onClick={() => handleSearchResultClick(`/projects/${p._id}`)}
                          >
                            <span style={{ fontSize: 14 }}>{p.icon || '📁'}</span>
                            <div className="topbar-search-result-info">
                              <div className="topbar-search-result-title">{p.name}</div>
                              <div className="topbar-search-result-sub">
                                {p.members?.length || 0} members
                              </div>
                            </div>
                            <FiArrowRight size={12} color="var(--text-muted)" />
                          </button>
                        ))}
                      </div>
                    )}
                  </>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Theme toggle */}
        <button className="topbar-icon-btn" onClick={toggleTheme} title="Toggle theme">
          <AnimatePresence mode="wait">
            <motion.span
              key={theme}
              initial={{ rotate: -90, opacity: 0 }}
              animate={{ rotate: 0, opacity: 1 }}
              exit={{ rotate: 90, opacity: 0 }}
              transition={{ duration: 0.2 }}
            >
              {theme === 'light' ? <FiMoon size={16} /> : <FiSun size={16} />}
            </motion.span>
          </AnimatePresence>
        </button>

        {/* Share */}
        <button className="topbar-icon-btn" onClick={handleShare} title="Share workspace">
          <FiShare2 size={16} />
        </button>

        {/* Notifications */}
        <div className="topbar-notif-wrapper" ref={notifRef}>
          <button
            className="topbar-icon-btn topbar-notification"
            onClick={() => setNotifOpen((o) => !o)}
            title="Notifications"
          >
            <FiBell size={16} />
            {unreadCount > 0 && (
              <span className="topbar-notification-badge">
                {unreadCount > 9 ? '9+' : unreadCount}
              </span>
            )}
          </button>

          <AnimatePresence>
            {notifOpen && (
              <motion.div
                className="topbar-notif-dropdown"
                initial={{ opacity: 0, y: -8, scale: 0.97 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -8, scale: 0.97 }}
                transition={{ duration: 0.15 }}
              >
                <div className="topbar-notif-header">
                  <span>Notifications</span>
                  {unreadCount > 0 && (
                    <button onClick={handleMarkAllRead}>Mark all read</button>
                  )}
                </div>

                <div className="topbar-notif-list">
                  {notifications.length === 0 ? (
                    <div className="topbar-search-empty">No notifications yet</div>
                  ) : (
                    notifications.map((n) => (
                      <button
                        key={n._id}
                        className={`topbar-notif-item ${!n.isRead ? 'unread' : ''}`}
                        onClick={() => handleNotifClick(n)}
                      >
                        <Avatar src={n.sender?.avatar?.url} name={n.sender?.name} size="sm" />
                        <div className="topbar-notif-content">
                          <div className="topbar-notif-title">{n.title}</div>
                          <div className="topbar-notif-msg">{n.message}</div>
                          <div className="topbar-notif-time">{formatRelativeTime(n.createdAt)}</div>
                        </div>
                        {!n.isRead && <div className="topbar-notif-dot" />}
                      </button>
                    ))
                  )}
                </div>

                <div className="topbar-notif-footer">
                  <button onClick={() => { navigate('/inbox'); setNotifOpen(false); }}>
                    View all notifications →
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </header>
  );
};

export default Topbar;