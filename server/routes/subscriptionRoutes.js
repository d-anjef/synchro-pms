import express from 'express';
import {
  getPlans,
  getMySubscription,
  createCheckoutSession,
  createPortalSession,
  manualUpgrade,
} from '../controllers/subscriptionController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.get('/plans', getPlans);
router.get('/', protect, getMySubscription);
router.post('/checkout', protect, createCheckoutSession);
router.post('/portal', protect, createPortalSession);
router.post('/manual-upgrade', protect, manualUpgrade);

export default router;