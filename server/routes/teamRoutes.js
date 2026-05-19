import express from 'express';
import {
  createTeam,
  getTeams,
  getTeamById,
  updateTeam,
  deleteTeam,
  addTeamMember,
  removeTeamMember,
} from '../controllers/teamController.js';
import { protect } from '../middleware/authMiddleware.js';
import { teamValidator } from '../validators/commonValidator.js';
import { validate } from '../validators/authValidator.js';

const router = express.Router();
router.use(protect);

router.route('/')
  .post(teamValidator, validate, createTeam)
  .get(getTeams);

router.route('/:id')
  .get(getTeamById)
  .put(updateTeam)
  .delete(deleteTeam);

router.post('/:id/members', addTeamMember);
router.delete('/:id/members/:userId', removeTeamMember);

export default router;