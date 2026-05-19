import { Link } from 'react-router-dom';
import { FiTwitter, FiGithub, FiLinkedin } from 'react-icons/fi';
import './Footer.css';

const Footer = () => (
  <footer className="public-footer">
    <div className="public-footer-container">
      <div className="public-footer-grid">
        <div className="public-footer-brand">
          <Link to="/" className="public-footer-logo">
            <div className="public-footer-logo-mark">S</div>
            <span>Synchro</span>
          </Link>
          <p>The premium project management platform for modern teams.</p>
          <div className="public-footer-socials">
            <a href="#" aria-label="Twitter"><FiTwitter size={16} /></a>
            <a href="#" aria-label="GitHub"><FiGithub size={16} /></a>
            <a href="#" aria-label="LinkedIn"><FiLinkedin size={16} /></a>
          </div>
        </div>

        <div className="public-footer-col">
          <h4>Product</h4>
          <a href="#features">Features</a>
          <Link to="/pricing">Pricing</Link>
          <a href="#testimonials">Testimonials</a>
          <a href="#faq">FAQ</a>
        </div>

        <div className="public-footer-col">
          <h4>Company</h4>
          <a href="#">About</a>
          <a href="#">Blog</a>
          <a href="#">Careers</a>
          <a href="#">Contact</a>
        </div>

        <div className="public-footer-col">
          <h4>Resources</h4>
          <a href="#">Help Center</a>
          <a href="#">Documentation</a>
          <a href="#">API Status</a>
          <a href="#">Changelog</a>
        </div>

        <div className="public-footer-col">
          <h4>Legal</h4>
          <a href="#">Privacy</a>
          <a href="#">Terms</a>
          <a href="#">Security</a>
          <a href="#">Cookies</a>
        </div>
        <div className="public-footer-col">
  <h4>Legal</h4>
  <Link to="/privacy">Privacy Policy</Link>
  <Link to="/terms">Terms of Service</Link>
  <Link to="/refund-policy">Refund Policy</Link>
  <Link to="/cookie-policy">Cookie Policy</Link>
</div>
      </div>

      <div className="public-footer-bottom">
        <p>© {new Date().getFullYear()} Synchro PMS. All rights reserved.</p>
        <p>Crafted with care for modern teams.</p>
      </div>
    </div>
  </footer>
);

export default Footer;