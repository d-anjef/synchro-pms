import { motion } from 'framer-motion';
import PricingSection from '../../components/public/PricingSection';
import FAQSection from '../../components/public/FAQSection';
import './PricingPage.css';

const PricingPage = () => (
  <>
    <section className="pricing-page-hero">
      <motion.div
        className="pricing-page-hero-content"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <div className="section-tag">Pricing</div>
        <h1>Pricing that scales with you</h1>
        <p>From solo founders to enterprise teams — Synchro grows with your needs.</p>
      </motion.div>
    </section>
    <PricingSection standalone />
    <FAQSection />
  </>
);

export default PricingPage;