import ActivityLog from '../models/ActivityLog.js';

export const createActivity = async ({
  user,
  action,
  entityType,
  entityId,
  project,
  description,
  metadata = {},
}) => {
  try {
    const activity = await ActivityLog.create({
      user,
      action,
      entityType,
      entityId,
      project,
      description,
      metadata,
    });
    return activity;
  } catch (err) {
    console.error('Activity log error:', err.message);
  }
};