import { useState, useRef } from 'react';
import { motion } from 'framer-motion';
import { FiCamera, FiMail, FiBriefcase, FiMapPin, FiPhone } from 'react-icons/fi';
import toast from 'react-hot-toast';
import Avatar from '../components/common/Avatar';
import Button from '../components/common/Button';
import { useAuth } from '../hooks/useAuth';
import { userService } from '../services/userService';
import { authService } from '../services/authServices';
import { ROLE_LABELS } from '../utils/constants';
import './Profile.css';

const Profile = () => {
  const { user, updateUser } = useAuth();
  const fileRef = useRef(null);
  const [tab, setTab] = useState('profile');

  const [form, setForm] = useState({
    name: user?.name || '',
    jobTitle: user?.jobTitle || '',
    bio: user?.bio || '',
    phone: user?.phone || '',
    location: user?.location || '',
  });
  const [pwd, setPwd] = useState({ currentPassword: '', newPassword: '' });
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const res = await userService.updateProfile(form);
      updateUser(res.user);
      toast.success('Profile updated!');
    } catch (err) {
      toast.error(err.message);
    } finally {
      setSaving(false);
    }
  };

  const handleAvatar = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 5 * 1024 * 1024) return toast.error('Image too large (max 5MB)');

    const fd = new FormData();
    fd.append('avatar', file);
    setUploading(true);
    try {
      const res = await userService.uploadAvatar(fd);
      updateUser({ avatar: res.avatar });
      toast.success('Avatar updated!');
    } catch (err) {
      toast.error(err.message);
    } finally {
      setUploading(false);
    }
  };

  const handlePassword = async (e) => {
    e.preventDefault();
    if (pwd.newPassword.length < 6) return toast.error('Min 6 characters');
    setSaving(true);
    try {
      await authService.updatePassword(pwd);
      toast.success('Password updated!');
      setPwd({ currentPassword: '', newPassword: '' });
    } catch (err) {
      toast.error(err.message);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="profile-page">
      <h1 className="profile-title">Profile Settings</h1>

      <div className="profile-tabs">
        <button className={tab === 'profile' ? 'active' : ''} onClick={() => setTab('profile')}>
          Profile
        </button>
        <button className={tab === 'security' ? 'active' : ''} onClick={() => setTab('security')}>
          Security
        </button>
      </div>

      {tab === 'profile' && (
        <motion.div className="profile-card" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
          {/* Avatar */}
          <div className="profile-avatar-row">
            <div className="profile-avatar-wrapper">
              <Avatar src={user?.avatar?.url} name={user?.name} size="2xl" />
              <button
                className="profile-avatar-upload"
                onClick={() => fileRef.current?.click()}
                disabled={uploading}
              >
                <FiCamera size={14} />
              </button>
              <input
                type="file"
                accept="image/*"
                ref={fileRef}
                onChange={handleAvatar}
                style={{ display: 'none' }}
              />
            </div>
            <div>
              <h2>{user?.name}</h2>
              <p className="profile-role-pill">{ROLE_LABELS[user?.role]}</p>
              <div className="profile-info-row">
                <span><FiMail size={13} /> {user?.email}</span>
              </div>
            </div>
          </div>

          <form onSubmit={handleSave} className="profile-form">
            <div className="form-grid">
              <div>
                <label className="form-label">Full Name</label>
                <input
                  type="text"
                  className="form-input"
                  style={{ paddingLeft: 14 }}
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                />
              </div>
              <div>
                <label className="form-label">Job Title</label>
                <input
                  type="text"
                  className="form-input"
                  style={{ paddingLeft: 14 }}
                  value={form.jobTitle}
                  onChange={(e) => setForm({ ...form, jobTitle: e.target.value })}
                  placeholder="e.g. Product Designer"
                />
              </div>
              <div>
                <label className="form-label">Phone</label>
                <input
                  type="text"
                  className="form-input"
                  style={{ paddingLeft: 14 }}
                  value={form.phone}
                  onChange={(e) => setForm({ ...form, phone: e.target.value })}
                />
              </div>
              <div>
                <label className="form-label">Location</label>
                <input
                  type="text"
                  className="form-input"
                  style={{ paddingLeft: 14 }}
                  value={form.location}
                  onChange={(e) => setForm({ ...form, location: e.target.value })}
                  placeholder="e.g. New York, USA"
                />
              </div>
            </div>
            <div>
              <label className="form-label">Bio</label>
              <textarea
                className="form-input"
                style={{ paddingLeft: 14, minHeight: 80, fontFamily: 'inherit', resize: 'vertical' }}
                value={form.bio}
                onChange={(e) => setForm({ ...form, bio: e.target.value })}
                placeholder="Tell us about yourself..."
              />
            </div>
            <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
              <Button type="submit" loading={saving}>Save Changes</Button>
            </div>
          </form>
        </motion.div>
      )}

      {tab === 'security' && (
        <motion.div className="profile-card" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
          <form onSubmit={handlePassword} className="profile-form">
            <h3 style={{ marginBottom: 16 }}>Change Password</h3>
            <div>
              <label className="form-label">Current Password</label>
              <input
                type="password"
                className="form-input"
                style={{ paddingLeft: 14 }}
                value={pwd.currentPassword}
                onChange={(e) => setPwd({ ...pwd, currentPassword: e.target.value })}
                required
              />
            </div>
            <div>
              <label className="form-label">New Password</label>
              <input
                type="password"
                className="form-input"
                style={{ paddingLeft: 14 }}
                value={pwd.newPassword}
                onChange={(e) => setPwd({ ...pwd, newPassword: e.target.value })}
                required
                minLength={6}
              />
            </div>
            <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
              <Button type="submit" loading={saving}>Update Password</Button>
            </div>
          </form>
        </motion.div>
      )}
    </div>
  );
};

export default Profile;