import User from '../models/User.js';
import Project from '../models/Project.js';
import Task from '../models/Task.js';
import ActivityLog from '../models/ActivityLog.js';

// @desc    Get all users (admin)
// @route   GET /api/admin/users
// @access  Admin
export const getAllUsersAdmin = async (req, res, next) => {
  try {
    const { search, role, isActive } = req.query;
    const query = {};
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } },
      ];
    }
    if (role) query.role = role;
    if (isActive !== undefined) query.isActive = isActive === 'true';

    const users = await User.find(query).sort({ createdAt: -1 });
    res.json({ success: true, count: users.length, users });
  } catch (error) {
    next(error);
  }
};

// @desc    Update user role
// @route   PATCH /api/admin/users/:id/role
// @access  Admin
export const updateUserRole = async (req, res, next) => {
  try {
    const { role } = req.body;
    if (!['admin', 'project_manager', 'team_member', 'client'].includes(role)) {
      return res.status(400).json({ success: false, message: 'Invalid role' });
    }
    const user = await User.findByIdAndUpdate(req.params.id, { role }, { new: true });
    res.json({ success: true, user });
  } catch (error) {
    next(error);
  }
};

// @desc    Activate / Deactivate user
// @route   PATCH /api/admin/users/:id/status
// @access  Admin
export const toggleUserStatus = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ success: false, message: 'User not found' });
    user.isActive = !user.isActive;
    await user.save();
    res.json({ success: true, user });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete user (admin)
// @route   DELETE /api/admin/users/:id
// @access  Admin
export const deleteUserAdmin = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ success: false, message: 'User not found' });
    if (user.role === 'admin') {
      return res.status(403).json({ success: false, message: 'Cannot delete admin' });
    }
    await user.deleteOne();
    res.json({ success: true, message: 'User deleted' });
  } catch (error) {
    next(error);
  }
};

// @desc    Get platform stats
// @route   GET /api/admin/stats
// @access  Admin
export const getPlatformStats = async (req, res, next) => {
  try {
    const [users, projects, tasks, completedTasks, activeUsers] =
      await Promise.all([
        User.countDocuments(),
        Project.countDocuments(),
        Task.countDocuments(),
        Task.countDocuments({ status: 'completed' }),
        User.countDocuments({ isOnline: true }),
      ]);

    const usersByRole = await User.aggregate([
      { $group: { _id: '$role', count: { $sum: 1 } } },
    ]);

    const projectsByStatus = await Project.aggregate([
      { $group: { _id: '$status', count: { $sum: 1 } } },
    ]);

    res.json({
      success: true,
      stats: {
        users,
        projects,
        tasks,
        completedTasks,
        activeUsers,
        usersByRole,
        projectsByStatus,
      },
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get all activities (admin)
// @route   GET /api/admin/activities
// @access  Admin
export const getAllActivities = async (req, res, next) => {
  try {
    const activities = await ActivityLog.find()
      .populate('user', 'name email avatar')
      .populate('project', 'name')
      .sort({ createdAt: -1 })
      .limit(100);
    res.json({ success: true, count: activities.length, activities });
  } catch (error) {
    next(error);
  }
};