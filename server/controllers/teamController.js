import Team from '../models/Team.js';
import User from '../models/User.js';
import { createBulkNotifications } from '../utils/createNotification.js';

// @desc    Create team
// @route   POST /api/teams
// @access  Private
export const createTeam = async (req, res, next) => {
  try {
    const team = await Team.create({
      ...req.body,
      owner: req.user._id,
      members: [{ user: req.user._id, role: 'admin' }],
    });

    await User.findByIdAndUpdate(req.user._id, { $addToSet: { teams: team._id } });

    const populated = await Team.findById(team._id)
      .populate('owner', 'name email avatar')
      .populate('members.user', 'name email avatar role');

    res.status(201).json({ success: true, team: populated });
  } catch (error) {
    next(error);
  }
};

// @desc    Get all teams
// @route   GET /api/teams
// @access  Private
export const getTeams = async (req, res, next) => {
  try {
    const teams = await Team.find({
      $or: [{ owner: req.user._id }, { 'members.user': req.user._id }],
      isArchived: false,
    })
      .populate('owner', 'name avatar')
      .populate('members.user', 'name email avatar')
      .sort({ updatedAt: -1 });

    res.json({ success: true, count: teams.length, teams });
  } catch (error) {
    next(error);
  }
};

// @desc    Get team by id
// @route   GET /api/teams/:id
// @access  Private
export const getTeamById = async (req, res, next) => {
  try {
    const team = await Team.findById(req.params.id)
      .populate('owner', 'name email avatar')
      .populate('members.user', 'name email avatar role jobTitle')
      .populate('projects', 'name icon color status');

    if (!team) return res.status(404).json({ success: false, message: 'Team not found' });
    res.json({ success: true, team });
  } catch (error) {
    next(error);
  }
};

// @desc    Update team
// @route   PUT /api/teams/:id
// @access  Private
export const updateTeam = async (req, res, next) => {
  try {
    const team = await Team.findById(req.params.id);
    if (!team) return res.status(404).json({ success: false, message: 'Team not found' });

    if (String(team.owner) !== String(req.user._id) && req.user.role !== 'admin') {
      return res.status(403).json({ success: false, message: 'Not authorized' });
    }

    const fields = ['name', 'description', 'icon', 'color', 'isArchived'];
    fields.forEach((f) => {
      if (req.body[f] !== undefined) team[f] = req.body[f];
    });
    await team.save();

    res.json({ success: true, team });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete team
// @route   DELETE /api/teams/:id
// @access  Private
export const deleteTeam = async (req, res, next) => {
  try {
    const team = await Team.findById(req.params.id);
    if (!team) return res.status(404).json({ success: false, message: 'Team not found' });

    if (String(team.owner) !== String(req.user._id) && req.user.role !== 'admin') {
      return res.status(403).json({ success: false, message: 'Not authorized' });
    }

    await team.deleteOne();
    res.json({ success: true, message: 'Team deleted' });
  } catch (error) {
    next(error);
  }
};

// @desc    Add team member
// @route   POST /api/teams/:id/members
// @access  Private
export const addTeamMember = async (req, res, next) => {
  try {
    const { userId, role = 'member' } = req.body;
    const team = await Team.findById(req.params.id);
    if (!team) return res.status(404).json({ success: false, message: 'Team not found' });

    const exists = team.members.some((m) => String(m.user) === String(userId));
    if (exists) return res.status(400).json({ success: false, message: 'Already a member' });

    team.members.push({ user: userId, role });
    await team.save();

    await User.findByIdAndUpdate(userId, { $addToSet: { teams: team._id } });

    const io = req.app.get('io');
    await createBulkNotifications(
      [userId],
      {
        sender: req.user._id,
        type: 'team_invite',
        title: 'Added to team',
        message: `${req.user.name} added you to "${team.name}"`,
        link: `/teams/${team._id}`,
      },
      io
    );

    res.json({ success: true, team });
  } catch (error) {
    next(error);
  }
};

// @desc    Remove team member
// @route   DELETE /api/teams/:id/members/:userId
// @access  Private
export const removeTeamMember = async (req, res, next) => {
  try {
    const team = await Team.findById(req.params.id);
    if (!team) return res.status(404).json({ success: false, message: 'Team not found' });

    team.members = team.members.filter((m) => String(m.user) !== String(req.params.userId));
    await team.save();

    await User.findByIdAndUpdate(req.params.userId, { $pull: { teams: team._id } });

    res.json({ success: true, message: 'Member removed' });
  } catch (error) {
    next(error);
  }
};