import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiPlus, FiMinus } from 'react-icons/fi';
import './FAQSection.css';

const FAQS = [
  {
    q: 'How does the 14-day free trial work?',
    a: 'When you sign up, you automatically get full access to all Pro features for 14 days. No credit card required. After 14 days, you can upgrade to a paid plan or continue on the Free plan.',
  },
  {
    q: 'Can I switch plans anytime?',
    a: 'Absolutely! You can upgrade, downgrade, or cancel your subscription at any time from your billing page. Changes take effect immediately.',
  },
  {
    q: 'What payment methods do you accept?',
    a: 'We accept all major credit cards (Visa, Mastercard, American Express) through our secure payment processor Stripe. We also support Apple Pay and Google Pay.',
  },
  {
    q: 'Is my data secure?',
    a: 'Yes. We use bank-level encryption (256-bit SSL) for all data in transit, and your data is stored in secure, encrypted databases. We never share your data with third parties.',
  },
  {
    q: 'Do you offer discounts for non-profits or education?',
    a: 'Yes! We offer 50% off all paid plans for verified non-profits and educational institutions. Contact our sales team for more information.',
  },
  {
    q: 'What happens to my data if I cancel?',
    a: 'You can export all your data anytime. After cancellation, your data remains accessible for 30 days, then it is permanently deleted from our servers.',
  },
];

const FAQSection = () => {
  const [open, setOpen] = useState(0);

  return (
    <section id="faq" className="faq-section">
      <div className="faq-container">
        <motion.div
          className="faq-header"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <div className="section-tag">FAQ</div>
          <h2>Frequently asked questions</h2>
          <p>Can't find what you're looking for? <a href="mailto:support@synchro.com">Contact our team</a></p>
        </motion.div>

        <div className="faq-list">
          {FAQS.map((item, i) => (
            <motion.div
              key={i}
              className={`faq-item ${open === i ? 'open' : ''}`}
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.05 }}
            >
              <button className="faq-item-q" onClick={() => setOpen(open === i ? -1 : i)}>
                <span>{item.q}</span>
                {open === i ? <FiMinus size={18} /> : <FiPlus size={18} />}
              </button>
              <AnimatePresence>
                {open === i && (
                  <motion.div
                    className="faq-item-a"
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                  >
                    <p>{item.a}</p>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FAQSection;