import { motion } from 'framer-motion';
import './temp.css';

const PrivacyPolicy = () => (
  <motion.div className="legal-page" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
    <div className="legal-container">
      <h1>Privacy Policy</h1>
      <p className="legal-updated">Last updated: {new Date().toLocaleDateString()}</p>

      <section>
        <h2>1. Information We Collect</h2>
        <h3>Personal Information:</h3>
        <ul>
          <li>Name and email address (registration)</li>
          <li>Profile information (job title, bio, avatar)</li>
          <li>Payment information (processed by eSewa/Khalti, never stored by us)</li>
        </ul>
        <h3>Usage Information:</h3>
        <ul>
          <li>IP address and browser type</li>
          <li>Pages visited and features used</li>
          <li>Tasks, projects, and files you create</li>
        </ul>
      </section>

      <section>
        <h2>2. How We Use Your Information</h2>
        <ul>
          <li>Provide and improve the Service</li>
          <li>Process payments and send invoices</li>
          <li>Send important notifications (e.g., password reset, billing)</li>
          <li>Marketing emails (you can opt out anytime)</li>
          <li>Analytics to improve user experience</li>
        </ul>
      </section>

      <section>
        <h2>3. Data Storage & Security</h2>
        <p>
          We use industry-standard encryption (HTTPS, bcrypt for passwords). Your data is stored in
          secure cloud databases (MongoDB Atlas) and CDN (Cloudinary) with bank-level security.
        </p>
      </section>

      <section>
        <h2>4. Third-Party Services</h2>
        <p>We use these trusted providers:</p>
        <ul>
          <li><strong>MongoDB Atlas</strong> — Database storage</li>
          <li><strong>Cloudinary</strong> — File storage</li>
          <li><strong>eSewa & Khalti</strong> — Payment processing</li>
          <li><strong>Gmail/SendGrid</strong> — Email delivery</li>
          <li><strong>Google Analytics</strong> — Anonymous usage analytics</li>
        </ul>
      </section>

      <section>
        <h2>5. Data Sharing</h2>
        <p>
          We <strong>never sell</strong> your personal data. We only share with:
        </p>
        <ul>
          <li>Service providers (listed above) under strict contracts</li>
          <li>Legal authorities when required by law</li>
          <li>Team members you invite to your workspace</li>
        </ul>
      </section>

      <section>
        <h2>6. Your Rights</h2>
        <p>You can:</p>
        <ul>
          <li>Access all your data anytime from Settings</li>
          <li>Export your data (Settings → Export Data)</li>
          <li>Delete your account permanently</li>
          <li>Opt out of marketing emails</li>
          <li>Request data deletion via email</li>
        </ul>
      </section>

      <section>
        <h2>7. Cookies</h2>
        <p>
          We use essential cookies for authentication and preferences. See our{' '}
          <a href="/cookie-policy">Cookie Policy</a>.
        </p>
      </section>

      <section>
        <h2>8. Data Retention</h2>
        <p>
          Active accounts: Data kept indefinitely. Deleted accounts: Data permanently erased within
          30 days, except where required by law.
        </p>
      </section>

      <section>
        <h2>9. Children's Privacy</h2>
        <p>
          Service is not intended for users under 13. We do not knowingly collect data from children.
        </p>
      </section>

      <section>
        <h2>10. Contact Us</h2>
        <p>
          Privacy questions? Email <a href="mailto:privacy@synchro.com">privacy@synchro.com</a>
        </p>
      </section>
    </div>
  </motion.div>
);

export default PrivacyPolicy;