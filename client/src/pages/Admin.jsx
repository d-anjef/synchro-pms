import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { FiUsers, FiFolder, FiCheckCircle, FiActivity, FiTrash2, FiUserX, FiUserCheck } from 'react-icons/fi';
import toast from 'react-hot-toast';
import StatsCard from '../components/dashboard/StatsCard';
import Loader from '../components/common/Loader';
import Avatar from '../components/common/Avatar';
import Button from '../components/common/Button';
import api from '../api/axios';
import { ROLE_LABELS } from '../utils/constants';
import { formatRelativeTime } from '../utils/formatters';
import './Admin.css';

const Admin = () => {
  const [stats, setStats] = useState(null);
  const [users, setUsers] = useState([]);
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState('users');

  useEffect(() => {
    load();
  }, []);

  const load = async () => {
    try {
      const [s, u, a] = await Promise.all([
        api.get('/admin/stats'),
        api.get('/admin/users'),
        api.get('/admin/activities'),
      ]);
      setStats(s.stats);
      setUsers(u.users);
      setActivities(a.activities);
    } catch (err) {
      toast.error('Failed to load admin data');
    } finally {
      setLoading(false);
    }
  };

  const handleRoleChange = async (id, role) => {
    try {
      await api.patch(`/admin/users/${id}/role`, { role });
      setUsers((u) => u.map((x) => (x._id === id ? { ...x, role } : x)));
      toast.success('Role updated');
    } catch (err) {
      toast.error(err.message);
    }
  };

  const handleToggleStatus = async (id) => {
    try {
      const res = await api.patch(`/admin/users/${id}/status`);
      setUsers((u) => u.map((x) => (x._id === id ? res.user : x)));
      toast.success('Status updated');
    } catch (err) {
      toast.error(err.message);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this user permanently?')) return;
    try {
      await api.delete(`/admin/users/${id}`);
      setUsers((u) => u.filter((x) => x._id !== id));
      toast.success('User deleted');
    } catch (err) {
      toast.error(err.message);
    }
  };

  if (loading) return <Loader fullScreen />;

  return (
    <div className="admin-page">
      <h1 className="admin-title">Admin Panel</h1>

      {/* Stats */}
      <div className="admin-stats">
        <StatsCard icon={<FiUsers />} label="Total Users" value={stats?.users} color="#6366f1" />
        <StatsCard icon={<FiFolder />} label="Projects" value={stats?.projects} color="#22c55e" />
        <StatsCard icon={<FiCheckCircle />} label="Tasks" value={stats?.tasks} color="#3b82f6" />
        <StatsCard icon={<FiActivity />} label="Active Now" value={stats?.activeUsers} color="#ec4899" />
      </div>

      {/* Tabs */}
      <div className="admin-tabs">
        <button className={tab === 'users' ? 'active' : ''} onClick={() => setTab('users')}>
          Users ({users.length})
        </button>
        <button className={tab === 'activity' ? 'active' : ''} onClick={() => setTab('activity')}>
          Activity Logs
        </button>
      </div>

      {tab === 'users' && (
        <motion.div className="admin-card" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
          <table className="admin-table">
            <thead>
              <tr>
                <th>User</th>
                <th>Role</th>
                <th>Status</th>
                <th>Joined</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.map((u) => (
                <tr key={u._id}>
                  <td>
                    <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
                      <Avatar src={u.avatar?.url} name={u.name} size="sm" />
                      <div>
                        <div style={{ fontWeight: 600, fontSize: 13 }}>{u.name}</div>
                        <div style={{ fontSize: 11.5, color: 'var(--text-tertiary)' }}>{u.email}</div>
                      </div>
                    </div>
                  </td>
                  <td>
                    <select
                      value={u.role}
                      onChange={(e) => handleRoleChange(u._id, e.target.value)}
                      className="admin-role-select"
                    >
                      {Object.entries(ROLE_LABELS).map(([v, l]) => (
                        <option key={v} value={v}>{l}</option>
                      ))}
                    </select>
                  </td>
                  <td>
                    <span className={`admin-status ${u.isActive ? 'active' : 'inactive'}`}>
                      {u.isActive ? 'Active' : 'Inactive'}
                    </span>
                  </td>
                  <td style={{ fontSize: 12.5, color: 'var(--text-tertiary)' }}>
                    {formatRelativeTime(u.createdAt)}
                  </td>
                  <td>
                    <div style={{ display: 'flex', gap: 6 }}>
                      <button className="admin-action-btn" onClick={() => handleToggleStatus(u._id)} title={u.isActive ? 'Deactivate' : 'Activate'}>
                        {u.isActive ? <FiUserX size={14} /> : <FiUserCheck size={14} />}
                      </button>
                      <button className="admin-action-btn danger" onClick={() => handleDelete(u._id)} title="Delete">
                        <FiTrash2 size={14} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </motion.div>
      )}

      {tab === 'activity' && (
        <motion.div className="admin-card" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
          <div className="admin-activity-list">
            {activities.map((a) => (
              <div key={a._id} className="admin-activity-row">
                <Avatar src={a.user?.avatar?.url} name={a.user?.name} size="sm" />
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 13 }}>{a.description}</div>
                  <div style={{ fontSize: 11.5, color: 'var(--text-tertiary)' }}>
                    {formatRelativeTime(a.createdAt)}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      )}
    </div>
  );
};

export default Admin;