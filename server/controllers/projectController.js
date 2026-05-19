import Project from '../models/Project.js';
import Task from '../models/Task.js';
import User from '../models/User.js';
import { createActivity } from '../utils/createActivity.js';
import { createBulkNotifications } from '../utils/createNotification.js';

// @desc    Create project
// @route   POST /api/projects
// @access  Private
export const createProject = async (req, res, next) => {
  try {
    const project = await Project.create({
      ...req.body,
      owner: req.user._id,
      members: [{ user: req.user._id, role: 'manager' }],
    });

    await User.findByIdAndUpdate(req.user._id, {
      $addToSet: { projects: project._id },
    });

    await createActivity({
      user: req.user._id,
      action: 'created_project',
      entityType: 'project',
      entityId: project._id,
      project: project._id,
      description: `${req.user.name} created project "${project.name}"`,
    });

    const populated = await Project.findById(project._id)
      .populate('owner', 'name email avatar')
      .populate('members.user', 'name email avatar role');

    res.status(201).json({ success: true, project: populated });
  } catch (error) {
    next(error);
  }
};

// @desc    Get all projects (for current user)
// @route   GET /api/projects
// @access  Private
export const getProjects = async (req, res, next) => {
  try {
    const { search, status, priority, archived } = req.query;

    const query = {
      $or: [
        { owner: req.user._id },
        { 'members.user': req.user._id },
      ],
      isArchived: archived === 'true',
    };

    if (status) query.status = status;
    if (priority) query.priority = priority;
    if (search) query.name = { $regex: search, $options: 'i' };

    const projects = await Project.find(query)
      .populate('owner', 'name email avatar')
      .populate('members.user', 'name email avatar')
      .sort({ updatedAt: -1 });

    res.json({ success: true, count: projects.length, projects });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single project
// @route   GET /api/projects/:id
// @access  Private
export const getProjectById = async (req, res, next) => {
  try {
    const project = await Project.findById(req.params.id)
      .populate('owner', 'name email avatar')
      .populate('members.user', 'name email avatar role jobTitle');

    if (!project) {
      return res.status(404).json({ success: false, message: 'Project not found' });
    }

    res.json({ success: true, project });
  } catch (error) {
    next(error);
  }
};

// @desc    Update project
// @route   PUT /api/projects/:id
// @access  Private
export const updateProject = async (req, res, next) => {
  try {
    const project = await Project.findById(req.params.id);
    if (!project) return res.status(404).json({ success: false, message: 'Project not found' });

    const isOwner = String(project.owner) === String(req.user._id);
    const isManager = project.members.some(
      (m) => String(m.user) === String(req.user._id) && m.role === 'manager'
    );

    if (!isOwner && !isManager && req.user.role !== 'admin') {
      return res.status(403).json({ success: false, message: 'Not authorized' });
    }

    const fields = ['name', 'description', 'icon', 'color', 'status', 'priority',
      'progress', 'startDate', 'dueDate', 'tags', 'labels', 'milestones', 'statusColumns', 'isArchived'];

    fields.forEach((f) => {
      if (req.body[f] !== undefined) project[f] = req.body[f];
    });

    await project.save();

    await createActivity({
      user: req.user._id,
      action: 'updated_project',
      entityType: 'project',
      entityId: project._id,
      project: project._id,
      description: `${req.user.name} updated project "${project.name}"`,
    });

    const populated = await Project.findById(project._id)
      .populate('owner', 'name email avatar')
      .populate('members.user', 'name email avatar');

    // Realtime
    const io = req.app.get('io');
    io.to(`project:${project._id}`).emit('project:updated', populated);

    res.json({ success: true, project: populated });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete project
// @route   DELETE /api/projects/:id
// @access  Private
export const deleteProject = async (req, res, next) => {
  try {
    const project = await Project.findById(req.params.id);
    if (!project) return res.status(404).json({ success: false, message: 'Project not found' });

    if (String(project.owner) !== String(req.user._id) && req.user.role !== 'admin') {
      return res.status(403).json({ success: false, message: 'Only owner can delete' });
    }

    await Task.deleteMany({ project: project._id });
    await project.deleteOne();

    res.json({ success: true, message: 'Project deleted' });
  } catch (error) {
    next(error);
  }
};

// @desc    Add member to project
// @route   POST /api/projects/:id/members
// @access  Private
export const addMember = async (req, res, next) => {
  try {
    const { userId, role = 'member' } = req.body;
    const project = await Project.findById(req.params.id);

    if (!project) return res.status(404).json({ success: false, message: 'Project not found' });

    const exists = project.members.some((m) => String(m.user) === String(userId));
    if (exists) return res.status(400).json({ success: false, message: 'User already a member' });

    project.members.push({ user: userId, role });
    await project.save();

    await User.findByIdAndUpdate(userId, { $addToSet: { projects: project._id } });

    const io = req.app.get('io');
    await createBulkNotifications(
      [userId],
      {
        sender: req.user._id,
        type: 'project_invite',
        title: 'Added to project',
        message: `${req.user.name} added you to "${project.name}"`,
        link: `/projects/${project._id}`,
        relatedProject: project._id,
      },
      io
    );

    const populated = await Project.findById(project._id)
      .populate('members.user', 'name email avatar role');

    res.json({ success: true, project: populated });
  } catch (error) {
    next(error);
  }
};

// @desc    Remove member from project
// @route   DELETE /api/projects/:id/members/:userId
// @access  Private
export const removeMember = async (req, res, next) => {
  try {
    const project = await Project.findById(req.params.id);
    if (!project) return res.status(404).json({ success: false, message: 'Project not found' });

    project.members = project.members.filter(
      (m) => String(m.user) !== String(req.params.userId)
    );
    await project.save();

    await User.findByIdAndUpdate(req.params.userId, { $pull: { projects: project._id } });

    res.json({ success: true, message: 'Member removed' });
  } catch (error) {
    next(error);
  }
};

// @desc    Get project statistics
// @route   GET /api/projects/:id/stats
// @access  Private
export const getProjectStats = async (req, res, next) => {
  try {
    const projectId = req.params.id;
    const tasks = await Task.find({ project: projectId });

    const stats = {
      total: tasks.length,
      todo: tasks.filter((t) => t.status === 'todo').length,
      inProgress: tasks.filter((t) => t.status === 'in_progress').length,
      inReview: tasks.filter((t) => t.status === 'in_review').length,
      completed: tasks.filter((t) => t.status === 'completed').length,
      overdue: tasks.filter(
        (t) => t.dueDate && new Date(t.dueDate) < new Date() && t.status !== 'completed'
      ).length,
    };

    stats.completionRate = stats.total > 0 ? Math.round((stats.completed / stats.total) * 100) : 0;

    res.json({ success: true, stats });
  } catch (error) {
    next(error);
  }
};