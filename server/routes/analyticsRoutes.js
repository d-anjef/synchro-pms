import express from 'express';
import {
  getDashboardAnalytics, getProjectAnalytics,
} from '../controllers/analyticsController.js';
import { protect } from '../middleware/authMiddleware.js';
import { requireFeature } from '../middleware/planMiddleware.js';

const router = express.Router();
router.use(protect);

router.get('/dashboard', getDashboardAnalytics); // basic dashboard for all
router.get('/project/:id', requireFeature('analytics'), getProjectAnalytics);

export default router;