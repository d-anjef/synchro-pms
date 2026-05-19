import express from 'express';
import {
  register,
  login,
  logout,
  getMe,
  forgotPassword,
  resetPassword,
  updatePassword,
} from '../controllers/authController.js';
import { protect } from '../middleware/authMiddleware.js';
import {
  registerValidator,
  loginValidator,
  forgotPasswordValidator,
  resetPasswordValidator,
  validate,
} from '../validators/authValidator.js';

const router = express.Router();

router.post('/register', registerValidator, validate, register);
router.post('/login', loginValidator, validate, login);
router.post('/logout', protect, logout);
router.get('/me', protect, getMe);
router.post('/forgot-password', forgotPasswordValidator, validate, forgotPassword);
router.put('/reset-password/:token', resetPasswordValidator, validate, resetPassword);
router.put('/update-password', protect, updatePassword);

export default router;