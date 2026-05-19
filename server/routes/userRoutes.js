import express from 'express';
import {
  getAllUsers,
  getUserById,
  updateProfile,
  uploadAvatar,
  toggleFavorite,
  deleteOwnAccount,
} from '../controllers/userController.js';
import { protect } from '../middleware/authMiddleware.js';
import upload from '../middleware/uploadMiddleware.js';

const router = express.Router();

router.use(protect);

router.get('/', getAllUsers);
router.put('/profile', updateProfile);
router.delete('/profile', deleteOwnAccount);
router.post('/avatar', upload.single('avatar'), uploadAvatar);
router.post('/favorites/:projectId', toggleFavorite);
router.get('/:id', getUserById);

export default router;