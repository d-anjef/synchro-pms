import mongoose from 'mongoose';

const activityLogSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    action: {
      type: String,
      required: true,
      // Examples: 'created_task', 'updated_task', 'deleted_project', 'commented'
    },
    entityType: {
      type: String,
      enum: ['task', 'project', 'comment', 'team', 'user', 'file'],
      required: true,
    },
    entityId: { type: mongoose.Schema.Types.ObjectId },
    project: { type: mongoose.Schema.Types.ObjectId, ref: 'Project' },
    description: { type: String, required: true },
    metadata: { type: mongoose.Schema.Types.Mixed },
  },
  { timestamps: true }
);

activityLogSchema.index({ project: 1, createdAt: -1 });
activityLogSchema.index({ user: 1, createdAt: -1 });

const ActivityLog = mongoose.model('ActivityLog', activityLogSchema);
export default ActivityLog;