import { motion } from 'framer-motion';
import './Legals.css';

const CookiePolicy = () => (
  <motion.div className="legal-page" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
    <div className="legal-container">
      <h1>Cookie Policy</h1>
      <p className="legal-updated">Last updated: {new Date().toLocaleDateString()}</p>

      <section>
        <h2>What Are Cookies?</h2>
        <p>
          Cookies are small text files stored on your device when you visit websites. They help the
          site remember your preferences and provide a better experience.
        </p>
      </section>

      <section>
        <h2>Cookies We Use</h2>

        <h3>🔐 Essential Cookies (Required)</h3>
        <p>These are necessary for the Service to function:</p>
        <ul>
          <li><code>token</code> — Authentication session</li>
          <li><code>theme</code> — Your light/dark mode preference</li>
        </ul>

        <h3>📊 Analytics Cookies (Optional)</h3>
        <p>Help us understand how the Service is used:</p>
        <ul>
          <li>Google Analytics — Anonymous usage statistics</li>
        </ul>

        <h3>💳 Functional Cookies</h3>
        <p>Remember your settings:</p>
        <ul>
          <li>Sidebar collapsed/expanded state</li>
          <li>View preferences (kanban vs list)</li>
        </ul>
      </section>

      <section>
        <h2>Managing Cookies</h2>
        <p>
          You can disable cookies in your browser settings, but the Service may not work properly
          without essential cookies.
        </p>
      </section>

      <section>
        <h2>Contact</h2>
        <p>
          Cookie questions? Email <a href="mailto:privacy@synchro.com">privacy@synchro.com</a>
        </p>
      </section>
    </div>
  </motion.div>
);

export default CookiePolicy;