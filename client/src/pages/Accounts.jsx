import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import {
  FiUsers, FiPlus, FiMail, FiSearch, FiMoreHorizontal, FiBriefcase,
} from 'react-icons/fi';
import toast from 'react-hot-toast';
import Avatar from '../components/common/Avatar';
import Button from '../components/common/Button';
import Loader from '../components/common/Loader';
import EmptyState from '../components/common/EmptyState';
import Modal from '../components/common/Modal';
import { userService } from '../services/userService';
import api from '../api/axios';
import { ROLE_LABELS } from '../utils/constants';
import { formatRelativeTime } from '../utils/formatters';
import './Accounts.css';

const Accounts = () => {
  const [users, setUsers] = useState([]);
  const [teams, setTeams] = useState([]);
  const [loading, setLoading] = useState(true);
  const [view, setView] = useState('members'); // members | teams
  const [search, setSearch] = useState('');
  const [inviteOpen, setInviteOpen] = useState(false);
  const [teamModalOpen, setTeamModalOpen] = useState(false);
  const [teamForm, setTeamForm] = useState({ name: '', description: '', icon: '👥', color: '#6366f1' });
  const [creating, setCreating] = useState(false);

  useEffect(() => {
    load();
  }, []);

  const load = async () => {
    try {
      const [u, t] = await Promise.all([
        userService.getAll(),
        api.get('/teams'),
      ]);
      setUsers(u.users);
      setTeams(t.teams);
    } catch (err) {
      toast.error('Failed to load accounts');
    } finally {
      setLoading(false);
    }
  };

  const handleCreateTeam = async (e) => {
    e.preventDefault();
    if (!teamForm.name.trim()) return toast.error('Team name required');
    setCreating(true);
    try {
      const res = await api.post('/teams', teamForm);
      setTeams((prev) => [res.team, ...prev]);
      toast.success('Team created!');
      setTeamModalOpen(false);
      setTeamForm({ name: '', description: '', icon: '👥', color: '#6366f1' });
    } catch (err) {
      toast.error(err.message);
    } finally {
      setCreating(false);
    }
  };

  const filteredUsers = users.filter((u) =>
    u.name.toLowerCase().includes(search.toLowerCase()) ||
    u.email.toLowerCase().includes(search.toLowerCase())
  );

  if (loading) return <Loader fullScreen />;

  return (
    <div className="accounts-page">
      {/* Header */}
      <motion.div
        className="accounts-header"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <div>
          <h1>Accounts</h1>
          <p>Manage your team members and groups</p>
        </div>
        <div style={{ display: 'flex', gap: 10 }}>
          {view === 'teams' && (
            <Button icon={<FiPlus />} onClick={() => setTeamModalOpen(true)}>
              New Team
            </Button>
          )}
          {view === 'members' && (
            <Button icon={<FiMail size={14} />} onClick={() => setInviteOpen(true)}>
              Invite Member
            </Button>
          )}
        </div>
      </motion.div>

      {/* Tabs */}
      <div className="accounts-tabs">
        <button
          className={view === 'members' ? 'active' : ''}
          onClick={() => setView('members')}
        >
          Members ({users.length})
        </button>
        <button
          className={view === 'teams' ? 'active' : ''}
          onClick={() => setView('teams')}
        >
          Teams ({teams.length})
        </button>
      </div>

      {/* Members View */}
      {view === 'members' && (
        <>
          <div className="accounts-toolbar">
            <div className="accounts-search">
              <FiSearch size={15} />
              <input
                type="text"
                placeholder="Search members by name or email..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
          </div>

          {filteredUsers.length === 0 ? (
            <EmptyState icon="👥" title="No members found" description="Try adjusting your search" />
          ) : (
            <div className="members-grid">
              {filteredUsers.map((u, i) => (
                <motion.div
                  key={u._id}
                  className="member-card"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.04 }}
                  whileHover={{ y: -2 }}
                >
                  <div className="member-card-top">
                    <Avatar src={u.avatar?.url} name={u.name} size="lg" status={u.isOnline ? 'online' : 'offline'} />
                    <button className="member-card-menu">
                      <FiMoreHorizontal size={16} />
                    </button>
                  </div>
                  <h3>{u.name}</h3>
                  <p className="member-card-job">
                    {u.jobTitle || ROLE_LABELS[u.role]}
                  </p>
                  <div className="member-card-meta">
                    <FiMail size={12} />
                    <span>{u.email}</span>
                  </div>
                  <div className="member-card-footer">
                    <span className={`member-status ${u.isOnline ? 'online' : ''}`}>
                      {u.isOnline ? 'Online now' : `Last seen ${formatRelativeTime(u.lastSeen)}`}
                    </span>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </>
      )}

      {/* Teams View */}
      {view === 'teams' && (
        <>
          {teams.length === 0 ? (
            <EmptyState
              icon="👥"
              title="No teams yet"
              description="Create teams to organize members and projects together."
              action={<Button icon={<FiPlus />} onClick={() => setTeamModalOpen(true)}>Create Team</Button>}
            />
          ) : (
            <div className="teams-grid">
              {teams.map((t, i) => (
                <motion.div
                  key={t._id}
                  className="team-card"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.05 }}
                  whileHover={{ y: -2 }}
                >
                  <div className="team-card-header">
                    <div className="team-card-icon" style={{ background: `${t.color}18`, color: t.color }}>
                      {t.icon}
                    </div>
                    <button className="team-card-menu">
                      <FiMoreHorizontal size={16} />
                    </button>
                  </div>
                  <h3>{t.name}</h3>
                  <p>{t.description || 'No description'}</p>

                  <div className="team-card-stats">
                    <div className="team-stat">
                      <FiUsers size={13} />
                      <span>{t.members?.length || 0} members</span>
                    </div>
                    <div className="team-stat">
                      <FiBriefcase size={13} />
                      <span>{t.projects?.length || 0} projects</span>
                    </div>
                  </div>

                  <div className="team-card-members">
                    {t.members?.slice(0, 6).map((m) => (
                      <Avatar key={m.user?._id} src={m.user?.avatar?.url} name={m.user?.name} size="sm" />
                    ))}
                    {t.members?.length > 6 && (
                      <div className="team-card-member-more">+{t.members.length - 6}</div>
                    )}
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </>
      )}

      {/* Invite Modal */}
      <Modal
        isOpen={inviteOpen}
        onClose={() => setInviteOpen(false)}
        title="Invite Member"
        size="sm"
      >
        <p style={{ color: 'var(--text-tertiary)', fontSize: 13.5, marginBottom: 16 }}>
          Share this link to invite new members to join your workspace.
        </p>
        <div style={{
          background: 'var(--bg-secondary)',
          border: '1px solid var(--border-primary)',
          borderRadius: 'var(--radius-md)',
          padding: 12,
          fontSize: 13,
          color: 'var(--text-primary)',
          fontFamily: 'monospace',
          marginBottom: 16,
          wordBreak: 'break-all',
        }}>
          {window.location.origin}/register
        </div>
        <Button
          fullWidth
          onClick={() => {
            navigator.clipboard.writeText(`${window.location.origin}/register`);
            toast.success('Link copied!');
          }}
        >
          Copy invite link
        </Button>
      </Modal>

      {/* Team Modal */}
      <Modal
        isOpen={teamModalOpen}
        onClose={() => setTeamModalOpen(false)}
        title="Create Team"
        size="md"
      >
        <form onSubmit={handleCreateTeam} style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          <div>
            <label className="form-label">Team Name</label>
            <input
              type="text"
              className="form-input"
              style={{ paddingLeft: 14 }}
              value={teamForm.name}
              onChange={(e) => setTeamForm({ ...teamForm, name: e.target.value })}
              placeholder="e.g. Design Team"
              autoFocus
            />
          </div>
          <div>
            <label className="form-label">Description</label>
            <textarea
              className="form-input"
              style={{ paddingLeft: 14, minHeight: 60, fontFamily: 'inherit', resize: 'vertical' }}
              value={teamForm.description}
              onChange={(e) => setTeamForm({ ...teamForm, description: e.target.value })}
              placeholder="What does this team do?"
            />
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
            <div>
              <label className="form-label">Icon</label>
              <input
                type="text"
                className="form-input"
                style={{ paddingLeft: 14, fontSize: 20, textAlign: 'center' }}
                value={teamForm.icon}
                onChange={(e) => setTeamForm({ ...teamForm, icon: e.target.value })}
              />
            </div>
            <div>
              <label className="form-label">Color</label>
              <input
                type="color"
                className="form-input"
                style={{ padding: 4, height: 42, cursor: 'pointer' }}
                value={teamForm.color}
                onChange={(e) => setTeamForm({ ...teamForm, color: e.target.value })}
              />
            </div>
          </div>
          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 10, marginTop: 8 }}>
            <Button type="button" variant="outline" onClick={() => setTeamModalOpen(false)}>Cancel</Button>
            <Button type="submit" loading={creating}>Create Team</Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default Accounts;