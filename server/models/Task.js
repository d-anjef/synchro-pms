import mongoose from 'mongoose';

const subtaskSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    completed: { type: Boolean, default: false },
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  },
  { timestamps: true }
);

const taskSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Task title is required'],
      trim: true,
      maxlength: 200,
    },
    description: { type: String, default: '', maxlength: 5000 },
    project: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Project',
      required: true,
    },
    status: {
      type: String,
      enum: ['todo', 'in_progress', 'in_review', 'completed'],
      default: 'todo',
    },
    priority: {
      type: String,
      enum: ['low', 'medium', 'high', 'urgent'],
      default: 'medium',
    },
    progress: { type: Number, default: 0, min: 0, max: 100 },
    dueDate: { type: Date },
    startDate: { type: Date },
    completedAt: { type: Date },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    assignees: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
    collaborators: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
    tags: [{ type: String, trim: true }],
    labels: [
      {
        name: String,
        color: String,
      },
    ],
    subtasks: [subtaskSchema],
    attachments: [{ type: mongoose.Schema.Types.ObjectId, ref: 'FileUpload' }],
    comments: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Comment' }],
    position: { type: Number, default: 0 },
    isArchived: { type: Boolean, default: false },
  },
  { timestamps: true }
);

taskSchema.index({ title: 'text', description: 'text' });
taskSchema.index({ project: 1, status: 1 });

const Task = mongoose.model('Task', taskSchema);
export default Task;