import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { FiMenu, FiX, FiMoon, FiSun } from 'react-icons/fi';
import { useTheme } from '../../hooks/useTheme';
import { useAuth } from '../../hooks/useAuth';
import Button from '../common/Button';
import './PublicNavbar.css';

const PublicNavbar = () => {
  const navigate = useNavigate();
  const { theme, toggleTheme } = useTheme();
  const { user } = useAuth();
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { label: 'Features', href: '#features' },
    { label: 'Pricing', to: '/pricing' },
    { label: 'Testimonials', href: '#testimonials' },
    { label: 'FAQ', href: '#faq' },
  ];

  return (
    <header className={`public-navbar ${scrolled ? 'scrolled' : ''}`}>
      <div className="public-navbar-container">
        <Link to="/" className="public-navbar-logo">
          <div className="public-navbar-logo-mark">S</div>
          <span>Synchro</span>
        </Link>

        <nav className="public-navbar-nav">
          {navLinks.map((link) => (
            link.to ? (
              <Link key={link.label} to={link.to}>{link.label}</Link>
            ) : (
              <a key={link.label} href={link.href}>{link.label}</a>
            )
          ))}
        </nav>

        <div className="public-navbar-actions">
          <button className="public-navbar-theme-btn" onClick={toggleTheme}>
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

          {user ? (
            <Button onClick={() => navigate('/dashboard')}>
              Go to Dashboard
            </Button>
          ) : (
            <>
              <Link to="/login" className="public-navbar-login">Sign in</Link>
              <Button onClick={() => navigate('/register')}>Get started</Button>
            </>
          )}

          <button
            className="public-navbar-mobile-toggle"
            onClick={() => setMobileOpen((o) => !o)}
          >
            {mobileOpen ? <FiX size={20} /> : <FiMenu size={20} />}
          </button>
        </div>
      </div>

      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            className="public-navbar-mobile"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
          >
            {navLinks.map((link) => (
              link.to ? (
                <Link key={link.label} to={link.to} onClick={() => setMobileOpen(false)}>
                  {link.label}
                </Link>
              ) : (
                <a key={link.label} href={link.href} onClick={() => setMobileOpen(false)}>
                  {link.label}
                </a>
              )
            ))}
            {!user && (
              <>
                <Link to="/login" onClick={() => setMobileOpen(false)}>Sign in</Link>
                <Link to="/register" onClick={() => setMobileOpen(false)} style={{ fontWeight: 600 }}>
                  Get started →
                </Link>
              </>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
};

export default PublicNavbar;