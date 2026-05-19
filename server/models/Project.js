import mongoose from 'mongoose';

const projectSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Project name is required'],
      trim: true,
      maxlength: 100,
    },
    description: { type: String, default: '', maxlength: 2000 },
    icon: { type: String, default: '📁' },
    color: { type: String, default: '#6366f1' },
    status: {
      type: String,
      enum: ['planning', 'active', 'on_hold', 'completed', 'cancelled'],
      default: 'planning',
    },
    priority: {
      type: String,
      enum: ['low', 'medium', 'high', 'urgent'],
      default: 'medium',
    },
    progress: { type: Number, default: 0, min: 0, max: 100 },
    startDate: { type: Date, default: Date.now },
    dueDate: { type: Date },
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    team: { type: mongoose.Schema.Types.ObjectId, ref: 'Team' },
    members: [
      {
        user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
        role: {
          type: String,
          enum: ['manager', 'member', 'viewer'],
          default: 'member',
        },
        joinedAt: { type: Date, default: Date.now },
      },
    ],
    tags: [{ type: String, trim: true }],
    labels: [
      {
        name: { type: String, required: true },
        color: { type: String, default: '#6366f1' },
      },
    ],
    milestones: [
      {
        title: { type: String, required: true },
        dueDate: { type: Date },
        completed: { type: Boolean, default: false },
      },
    ],
    statusColumns: {
      type: [String],
      default: ['todo', 'in_progress', 'in_review', 'completed'],
    },
    isArchived: { type: Boolean, default: false },
  },
  { timestamps: true }
);

projectSchema.index({ name: 'text', description: 'text' });

const Project = mongoose.model('Project', projectSchema);
export default Project; 