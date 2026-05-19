import express from 'express';
import {
  addComment,
  getComments,
  updateComment,
  deleteComment,
} from '../controllers/commentController.js';
import { protect } from '../middleware/authMiddleware.js';
import { commentValidator } from '../validators/commonValidator.js';
import { validate } from '../validators/authValidator.js';

const router = express.Router();
router.use(protect);

router.post('/', commentValidator, validate, addComment);
router.get('/task/:taskId', getComments);
router.put('/:id', updateComment);
router.delete('/:id', deleteComment);

export default router;