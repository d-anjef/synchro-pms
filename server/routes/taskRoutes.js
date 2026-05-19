import express from 'express';
import {
  createTask, getTasks, getTaskById, updateTask, updateTaskStatus,
  reorderTasks, deleteTask, addSubtask, toggleSubtask, deleteSubtask, getMyTasks,
} from '../controllers/taskController.js';
import { protect } from '../middleware/authMiddleware.js';
import { taskValidator } from '../validators/commonValidator.js';
import { validate } from '../validators/authValidator.js';
import { checkTaskLimit } from '../middleware/planMiddleware.js';

const router = express.Router();
router.use(protect);

router.route('/')
  .post(checkTaskLimit, taskValidator, validate, createTask)
  .get(getTasks);

router.get('/my-tasks', getMyTasks);
router.patch('/reorder', reorderTasks);

router.route('/:id')
  .get(getTaskById)
  .put(updateTask)
  .delete(deleteTask);

router.patch('/:id/status', updateTaskStatus);
router.post('/:id/subtasks', addSubtask);
router.patch('/:id/subtasks/:subId', toggleSubtask);
router.delete('/:id/subtasks/:subId', deleteSubtask);

export default router;