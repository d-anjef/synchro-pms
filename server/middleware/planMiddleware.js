import { hasFeature, checkLimit, getPlan } from '../utils/plans.js';
import Project from '../models/Project.js';
import Task from '../models/Task.js';

// Require specific feature
export const requireFeature = (feature) => (req, res, next) => {
  if (!hasFeature(req.user, feature)) {
    const plan = getPlan(req.user?.subscription?.plan);
    return res.status(403).json({
      success: false,
      message: `This feature requires a paid plan. Your current plan: ${plan.name}`,
      upgradeRequired: true,
      feature,
    });
  }
  next();
};

// Check project limit before creation
export const checkProjectLimit = async (req, res, next) => {
  try {
    const count = await Project.countDocuments({ owner: req.user._id });
    const result = checkLimit(req.user, 'projects', count);
    if (!result.allowed) {
      return res.status(403).json({
        success: false,
        message: `You've reached your project limit (${result.limit}). Upgrade to create more.`,
        upgradeRequired: true,
        limit: result.limit,
        current: result.current,
      });
    }
    next();
  } catch (err) {
    next(err);
  }
};

// Check task limit per project
export const checkTaskLimit = async (req, res, next) => {
  try {
    if (!req.body.project) return next();
    const count = await Task.countDocuments({ project: req.body.project });
    const result = checkLimit(req.user, 'tasksPerProject', count);
    if (!result.allowed) {
      return res.status(403).json({
        success: false,
        message: `Task limit reached for this project (${result.limit}). Upgrade to add more.`,
        upgradeRequired: true,
      });
    }
    next();
  } catch (err) {
    next(err);
  }
};