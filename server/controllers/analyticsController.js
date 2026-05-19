import Task from '../models/Task.js';
import Project from '../models/Project.js';
import User from '../models/User.js';

// @desc    Dashboard analytics for user
// @route   GET /api/analytics/dashboard
// @access  Private
export const getDashboardAnalytics = async (req, res, next) => {
  try {
    const userId = req.user._id;

    const [totalProjects, totalTasks, completedTasks, overdueTasks, myTasks] =
      await Promise.all([
        Project.countDocuments({
          $or: [{ owner: userId }, { 'members.user': userId }],
        }),
        Task.countDocuments({ assignees: userId }),
        Task.countDocuments({ assignees: userId, status: 'completed' }),
        Task.countDocuments({
          assignees: userId,
          dueDate: { $lt: new Date() },
          status: { $ne: 'completed' },
        }),
        Task.find({ assignees: userId, isArchived: false })
          .populate('project', 'name icon color')
          .sort({ dueDate: 1 })
          .limit(5),
      ]);

    const statusBreakdown = await Task.aggregate([
      { $match: { assignees: userId } },
      { $group: { _id: '$status', count: { $sum: 1 } } },
    ]);

    const priorityBreakdown = await Task.aggregate([
      { $match: { assignees: userId } },
      { $group: { _id: '$priority', count: { $sum: 1 } } },
    ]);

    // Last 7 days completion
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

    const productivity = await Task.aggregate([
      {
        $match: {
          assignees: userId,
          completedAt: { $gte: sevenDaysAgo },
          status: 'completed',
        },
      },
      {
        $group: {
          _id: { $dateToString: { format: '%Y-%m-%d', date: '$completedAt' } },
          count: { $sum: 1 },
        },
      },
      { $sort: { _id: 1 } },
    ]);

    const completionRate = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

    res.json({
      success: true,
      analytics: {
        totalProjects,
        totalTasks,
        completedTasks,
        overdueTasks,
        completionRate,
        statusBreakdown,
        priorityBreakdown,
        productivity,
        myTasks,
      },
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Project analytics
// @route   GET /api/analytics/project/:id
// @access  Private
export const getProjectAnalytics = async (req, res, next) => {
  try {
    const projectId = req.params.id;

    const tasks = await Task.find({ project: projectId });
    const total = tasks.length;
    const completed = tasks.filter((t) => t.status === 'completed').length;

    const statusBreakdown = await Task.aggregate([
      { $match: { project: tasks[0]?.project } },
      { $group: { _id: '$status', count: { $sum: 1 } } },
    ]);

    const memberPerformance = await Task.aggregate([
      { $match: { project: tasks[0]?.project } },
      { $unwind: '$assignees' },
      {
        $group: {
          _id: '$assignees',
          total: { $sum: 1 },
          completed: {
            $sum: { $cond: [{ $eq: ['$status', 'completed'] }, 1, 0] },
          },
        },
      },
      {
        $lookup: {
          from: 'users',
          localField: '_id',
          foreignField: '_id',
          as: 'user',
        },
      },
      { $unwind: '$user' },
      {
        $project: {
          name: '$user.name',
          avatar: '$user.avatar',
          total: 1,
          completed: 1,
        },
      },
    ]);

    res.json({
      success: true,
      analytics: {
        total,
        completed,
        completionRate: total > 0 ? Math.round((completed / total) * 100) : 0,
        statusBreakdown,
        memberPerformance,
      },
    });
  } catch (error) {
    next(error);
  }
};