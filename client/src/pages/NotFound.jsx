import { Link } from 'react-router-dom';

const NotFound = () => (
  <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 16 }}>
    <h1 style={{ fontSize: 80, fontWeight: 800 }}>404</h1>
    <p style={{ color: 'var(--text-tertiary)' }}>Page not found</p>
    <Link to="/dashboard" style={{ padding: '10px 24px', background: 'var(--accent-primary)', color: 'var(--text-inverse)', borderRadius: 10, fontWeight: 600 }}>
      Go to Dashboard
    </Link>
  </div>
);

export default NotFound;