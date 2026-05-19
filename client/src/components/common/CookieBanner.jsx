import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import { FiX } from 'react-icons/fi';
import Button from './Button';
import './CookieBanner.css';

const CookieBanner = () => {
  const [show, setShow] = useState(false);

  useEffect(() => {
    const accepted = localStorage.getItem('cookieConsent');
    if (!accepted) {
      setTimeout(() => setShow(true), 1500);
    }
  }, []);

  const handleAccept = () => {
    localStorage.setItem('cookieConsent', 'accepted');
    localStorage.setItem('cookieConsentDate', new Date().toISOString());
    setShow(false);
  };

  const handleReject = () => {
    localStorage.setItem('cookieConsent', 'essential-only');
    setShow(false);
  };

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          className="cookie-banner"
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 100, opacity: 0 }}
          transition={{ duration: 0.3 }}
        >
          <div className="cookie-banner-content">
            <div className="cookie-banner-text">
              <strong>🍪 We use cookies</strong>
              <p>
                We use essential cookies to make our site work. With your consent, we may
                also use analytics cookies to improve your experience.{' '}
                <Link to="/cookie-policy">Learn more</Link>
              </p>
            </div>
            <div className="cookie-banner-actions">
              <Button variant="outline" size="sm" onClick={handleReject}>
                Essential only
              </Button>
              <Button size="sm" onClick={handleAccept}>
                Accept all
              </Button>
              <button className="cookie-banner-close" onClick={handleReject}>
                <FiX size={16} />
              </button>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default CookieBanner;