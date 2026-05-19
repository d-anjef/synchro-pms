import { motion } from 'framer-motion';
import { FiStar } from 'react-icons/fi';
import './TestimonialsSection.css';

const TESTIMONIALS = [
  {
    name: 'Sarah Chen',
    role: 'Head of Product, TechCorp',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=120&h=120&fit=crop',
    quote: 'Synchro transformed how our team works. The realtime collaboration is a game-changer. We ship features 40% faster.',
    rating: 5,
  },
  {
    name: 'Marcus Reed',
    role: 'CTO, StartupLab',
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=120&h=120&fit=crop',
    quote: 'The best PM tool I have used in 15 years. Beautiful, fast, and packed with features that just work.',
    rating: 5,
  },
  {
    name: 'Priya Sharma',
    role: 'Project Manager, DesignHub',
    avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=120&h=120&fit=crop',
    quote: 'We tried Jira, Asana, Monday — Synchro beats them all on UX. Our designers actually enjoy using it.',
    rating: 5,
  },
];

const TestimonialsSection = () => (
  <section id="testimonials" className="testimonials-section">
    <div className="testimonials-container">
      <motion.div
        className="testimonials-header"
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
      >
        <div className="section-tag">Testimonials</div>
        <h2>Loved by teams worldwide</h2>
        <p>Join 10,000+ teams that have made the switch to Synchro</p>
      </motion.div>

      <div className="testimonials-grid">
        {TESTIMONIALS.map((t, i) => (
          <motion.div
            key={i}
            className="testimonial-card"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.1 }}
          >
            <div className="testimonial-stars">
              {Array.from({ length: t.rating }).map((_, j) => (
                <FiStar key={j} size={14} fill="#f59e0b" color="#f59e0b" />
              ))}
            </div>
            <p className="testimonial-quote">"{t.quote}"</p>
            <div className="testimonial-author">
              <img src={t.avatar} alt={t.name} />
              <div>
                <div className="testimonial-name">{t.name}</div>
                <div className="testimonial-role">{t.role}</div>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  </section>
);

export default TestimonialsSection;