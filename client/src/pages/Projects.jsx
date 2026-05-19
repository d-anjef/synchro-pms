import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { FiPlus, FiSearch } from 'react-icons/fi';
import toast from 'react-hot-toast';
import ProjectCard from '../components/projects/ProjectCard';
import Button from '../components/common/Button';
import Loader from '../components/common/Loader';
import EmptyState from '../components/common/EmptyState';
import Modal from '../components/common/Modal';
import { projectService } from '../services/projectService';
import './Projects.css';

const Projects = () => {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [createOpen, setCreateOpen] = useState(false);
  const [form, setForm] = useState({
    name: '', description: '', icon: '📁', color: '#6366f1', priority: 'medium',
  });
  const [creating, setCreating] = useState(false);

  useEffect(() => {
    load();
  }, []);

  const load = async () => {
    try {
      const res = await projectService.getAll();
      setProjects(res.projects);
    } catch (err) {
      toast.error(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = async (e) => {
    e.preventDefault();
    if (!form.name.trim()) return toast.error('Name is required');
    setCreating(true);
    try {
      const res = await projectService.create(form);
      setProjects((p) => [res.project, ...p]);
      toast.success('Project created!');
      setCreateOpen(false);
      setForm({ name: '', description: '', icon: '📁', color: '#6366f1', priority: 'medium' });
    } catch (err) {
      toast.error(err.message);
    } finally {
      setCreating(false);
    }
  };

  const filtered = projects.filter((p) =>
    p.name.toLowerCase().includes(search.toLowerCase())
  );

  if (loading) return <Loader fullScreen />;

  return (
    <div className="projects-page">
      <div className="projects-header">
        <div>
          <h1>Projects</h1>
          <p>Manage and track all your projects in one place</p>
        </div>
        <Button icon={<FiPlus />} onClick={() => setCreateOpen(true)}>
          New Project
        </Button>
      </div>

      <div className="projects-toolbar">
        <div className="projects-search">
          <FiSearch size={15} />
          <input
            type="text"
            placeholder="Search projects..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </div>

      {filtered.length === 0 ? (
        <EmptyState
          icon="📁"
          title="No projects yet"
          description="Create your first project to start collaborating with your team."
          action={<Button icon={<FiPlus />} onClick={() => setCreateOpen(true)}>Create Project</Button>}
        />
      ) : (
        <div className="projects-grid">
          {filtered.map((p, i) => (
            <ProjectCard key={p._id} project={p} delay={i * 0.05} />
          ))}
        </div>
      )}

      {/* Create modal */}
      <Modal
        isOpen={createOpen}
        onClose={() => setCreateOpen(false)}
        title="Create Project"
        size="md"
      >
        <form onSubmit={handleCreate} style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          <div>
            <label className="form-label">Project Name</label>
            <input
              type="text"
              className="form-input"
              style={{ paddingLeft: 14 }}
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              placeholder="e.g. Marketing Website"
              autoFocus
            />
          </div>
          <div>
            <label className="form-label">Description</label>
            <textarea
              className="form-input"
              style={{ paddingLeft: 14, minHeight: 80, fontFamily: 'inherit', resize: 'vertical' }}
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
              placeholder="What is this project about?"
            />
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 12 }}>
            <div>
              <label className="form-label">Icon</label>
              <input
                type="text"
                className="form-input"
                style={{ paddingLeft: 14, fontSize: 20, textAlign: 'center' }}
                value={form.icon}
                onChange={(e) => setForm({ ...form, icon: e.target.value })}
              />
            </div>
            <div>
              <label className="form-label">Color</label>
              <input
                type="color"
                className="form-input"
                style={{ padding: 4, height: 42, cursor: 'pointer' }}
                value={form.color}
                onChange={(e) => setForm({ ...form, color: e.target.value })}
              />
            </div>
            <div>
              <label className="form-label">Priority</label>
              <select
                className="form-input"
                style={{ paddingLeft: 14 }}
                value={form.priority}
                onChange={(e) => setForm({ ...form, priority: e.target.value })}
              >
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
                <option value="urgent">Urgent</option>
              </select>
            </div>
          </div>
          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 10, marginTop: 8 }}>
            <Button type="button" variant="outline" onClick={() => setCreateOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" loading={creating}>Create Project</Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default Projects;