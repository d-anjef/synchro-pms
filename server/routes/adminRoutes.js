import express from 'express';
import {
  getAllUsersAdmin,
  updateUserRole,
  toggleUserStatus,
  deleteUserAdmin,
  getPlatformStats,
  getAllActivities,
} from '../controllers/adminController.js';
import { protect, authorize } from '../middleware/authMiddleware.js';

const router = express.Router();
router.use(protect, authorize('admin'));

router.get('/users', getAllUsersAdmin);
router.patch('/users/:id/role', updateUserRole);
router.patch('/users/:id/status', toggleUserStatus);
router.delete('/users/:id', deleteUserAdmin);
router.get('/stats', getPlatformStats);
router.get('/activities', getAllActivities);

export default router;