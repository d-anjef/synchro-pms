import ActivityLog from '../models/ActivityLog.js';

// @desc    Get activities (project / user / global)
// @route   GET /api/activities
// @access  Private
export const getActivities = async (req, res, next) => {
  try {
    const { project, user, limit = 30 } = req.query;
    const query = {};
    if (project) query.project = project;
    if (user) query.user = user;

    const activities = await ActivityLog.find(query)
      .populate('user', 'name avatar')
      .populate('project', 'name icon')
      .sort({ createdAt: -1 })
      .limit(Number(limit));

    res.json({ success: true, count: activities.length, activities });
  } catch (error) {
    next(error);
  }
};

// @desc    Get my activities feed
// @route   GET /api/activities/feed
// @access  Private
export const getMyFeed = async (req, res, next) => {
  try {
    const activities = await ActivityLog.find({ user: req.user._id })
      .populate('project', 'name icon color')
      .sort({ createdAt: -1 })
      .limit(50);
    res.json({ success: true, activities });
  } catch (error) {
    next(error);
  }
};