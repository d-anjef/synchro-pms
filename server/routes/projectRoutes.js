import express from 'express';
import {
  createProject, getProjects, getProjectById,
  updateProject, deleteProject, addMember, removeMember, getProjectStats,
} from '../controllers/projectController.js';
import { protect } from '../middleware/authMiddleware.js';
import { projectValidator } from '../validators/commonValidator.js';
import { validate } from '../validators/authValidator.js';
import { checkProjectLimit } from '../middleware/planMiddleware.js';

const router = express.Router();
router.use(protect);

router.route('/')
  .post(checkProjectLimit, projectValidator, validate, createProject)
  .get(getProjects);

router.route('/:id')
  .get(getProjectById)
  .put(updateProject)
  .delete(deleteProject);

router.get('/:id/stats', getProjectStats);
router.post('/:id/members', addMember);
router.delete('/:id/members/:userId', removeMember);

export default router;