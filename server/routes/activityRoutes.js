import express from 'express';
import { getActivities, getMyFeed } from '../controllers/activityController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();
router.use(protect);

router.get('/', getActivities);
router.get('/feed', getMyFeed);

export default router;