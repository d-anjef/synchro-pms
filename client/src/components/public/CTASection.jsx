import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { FiArrowRight } from 'react-icons/fi';
import Button from '../common/Button';
import './CTASection.css';

const CTASection = () => {
  const navigate = useNavigate();
  return (
    <section className="cta-section">
      <div className="cta-container">
        <motion.div
          className="cta-card"
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
        >
          <h2>Ready to ship faster?</h2>
          <p>Join 10,000+ teams already using Synchro. Start your free trial today.</p>
          <div className="cta-actions">
            <Button
              size="lg"
              onClick={() => navigate('/register')}
              icon={<FiArrowRight />}
              iconPosition="right"
            >
              Start free trial
            </Button>
            <Button
              variant="ghost"
              size="lg"
              onClick={() => navigate('/pricing')}
            >
              View pricing
            </Button>
          </div>
          <p className="cta-note">No credit card required · 14-day Pro trial · Cancel anytime</p>
        </motion.div>
      </div>
    </section>
  );
};

export default CTASection;