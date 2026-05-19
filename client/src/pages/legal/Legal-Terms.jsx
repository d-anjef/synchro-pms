import { motion } from 'framer-motion';
import './temp.css';

const TermsOfService = () => (
  <motion.div className="legal-page" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
    <div className="legal-container">
      <h1>Terms of Service</h1>
      <p className="legal-updated">Last updated: {new Date().toLocaleDateString()}</p>

      <section>
        <h2>1. Acceptance of Terms</h2>
        <p>
          By accessing or using Synchro PMS ("Service"), you agree to be bound by these Terms of Service.
          If you disagree with any part, you may not access the Service.
        </p>
      </section>

      <section>
        <h2>2. Description of Service</h2>
        <p>
          Synchro PMS is a project management platform that provides task tracking, team collaboration,
          file storage, and realtime communication tools for individuals and teams.
        </p>
      </section>

      <section>
        <h2>3. Accounts</h2>
        <p>
          When you create an account, you must provide accurate information. You are responsible for
          maintaining the security of your account and password. We cannot be liable for any loss
          resulting from your failure to comply with this security obligation.
        </p>
      </section>

      <section>
        <h2>4. Subscription & Billing</h2>
        <ul>
          <li>Free plan: Limited features, no payment required</li>
          <li>Paid plans: Billed monthly or yearly in NPR</li>
          <li>14-day free trial of Pro plan for new users</li>
          <li>Auto-renewal until cancelled</li>
          <li>Prices are subject to change with 30 days notice</li>
        </ul>
      </section>

      <section>
        <h2>5. Cancellation & Refunds</h2>
        <p>
          You may cancel your subscription at any time. See our{' '}
          <a href="/refund-policy">Refund Policy</a> for details.
        </p>
      </section>

      <section>
        <h2>6. User Content</h2>
        <p>
          You retain all rights to content you upload. By uploading, you grant us a license to store,
          display, and process your content solely to provide the Service.
        </p>
      </section>

      <section>
        <h2>7. Prohibited Uses</h2>
        <p>You may not use the Service to:</p>
        <ul>
          <li>Violate any laws or regulations</li>
          <li>Upload malicious code or content</li>
          <li>Harass, abuse, or harm other users</li>
          <li>Reverse engineer or copy the Service</li>
          <li>Share accounts across multiple users (1 paid account = 1 user)</li>
        </ul>
      </section>

      <section>
        <h2>8. Termination</h2>
        <p>
          We may suspend or terminate your account if you violate these Terms. You may delete your
          account anytime from Settings.
        </p>
      </section>

      <section>
        <h2>9. Limitation of Liability</h2>
        <p>
          Synchro PMS is provided "as is" without warranties. We are not liable for any indirect,
          incidental, or consequential damages.
        </p>
      </section>

      <section>
        <h2>10. Changes to Terms</h2>
        <p>
          We may update these Terms anytime. We'll notify you of significant changes via email.
          Continued use after changes means you accept the new Terms.
        </p>
      </section>

      <section>
        <h2>11. Contact</h2>
        <p>
          Questions? Email us at <a href="mailto:legal@synchro.com">legal@synchro.com</a>
        </p>
      </section>
    </div>
  </motion.div>
);

export default TermsOfService;