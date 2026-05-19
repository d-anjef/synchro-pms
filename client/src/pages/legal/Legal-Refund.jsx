import { motion } from 'framer-motion';
import './temp.css';

const RefundPolicy = () => (
  <motion.div className="legal-page" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
    <div className="legal-container">
      <h1>Refund Policy</h1>
      <p className="legal-updated">Last updated: {new Date().toLocaleDateString()}</p>

      <section>
        <h2>Our Promise</h2>
        <p>
          We want you to love Synchro PMS. If you're not satisfied, we offer a fair refund policy
          described below.
        </p>
      </section>

      <section>
        <h2>14-Day Money-Back Guarantee</h2>
        <p>
          New Pro and Business subscriptions are eligible for a <strong>full refund within 14 days</strong>
          of initial payment if you're not satisfied for any reason.
        </p>
      </section>

      <section>
        <h2>How to Request a Refund</h2>
        <ol>
          <li>Email <a href="mailto:billing@synchro.com">billing@synchro.com</a> within 14 days of payment</li>
          <li>Include your account email and reason for refund</li>
          <li>We'll process refunds within 5-7 business days</li>
          <li>Funds returned to your original payment method (eSewa/Khalti)</li>
        </ol>
      </section>

      <section>
        <h2>Non-Refundable Cases</h2>
        <ul>
          <li>Refund requests after 14 days of payment</li>
          <li>Renewal payments (only initial subscription qualifies)</li>
          <li>Accounts terminated for violating Terms of Service</li>
          <li>Refunds requested due to feature changes (we provide notice for major changes)</li>
        </ul>
      </section>

      <section>
        <h2>Cancellation vs Refund</h2>
        <p>
          <strong>Cancellation:</strong> Stops future billing. You keep access until end of paid period.
        </p>
        <p>
          <strong>Refund:</strong> Returns money paid. Access ends immediately upon refund.
        </p>
      </section>

      <section>
        <h2>Free Trial</h2>
        <p>
          The 14-day Pro trial requires no payment. You can cancel anytime during the trial without charge.
          No refund is needed since you won't be billed.
        </p>
      </section>

      <section>
        <h2>Contact</h2>
        <p>
          Refund questions? Email <a href="mailto:billing@synchro.com">billing@synchro.com</a>
        </p>
      </section>
    </div>
  </motion.div>
);

export default RefundPolicy;