import express from 'express';
import {
  initiateEsewa,
  esewaSuccess,
  esewaFailure,
  initiateKhalti,
  khaltiVerify,
  getPaymentHistory,
  cancelSubscription,
} from '../controllers/paymentController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

// eSewa
router.post('/esewa/initiate', protect, initiateEsewa);
router.get('/esewa/success', esewaSuccess);
router.get('/esewa/failure', esewaFailure);

// Khalti
router.post('/khalti/initiate', protect, initiateKhalti);
router.get('/khalti/verify', khaltiVerify);

// Common
router.get('/history', protect, getPaymentHistory);
router.post('/cancel', protect, cancelSubscription);

export default router;