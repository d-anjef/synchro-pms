import mongoose from 'mongoose';

const commentSchema = new mongoose.Schema(
  {
    content: {
      type: String,
      required: true,
      trim: true,
      maxlength: 2000,
    },
    author: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    task: { type: mongoose.Schema.Types.ObjectId, ref: 'Task' },
    project: { type: mongoose.Schema.Types.ObjectId, ref: 'Project' },
    mentions: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
    attachments: [
      {
        url: String,
        publicId: String,
        name: String,
        type: String,
      },
    ],
    isEdited: { type: Boolean, default: false },
    parentComment: { type: mongoose.Schema.Types.ObjectId, ref: 'Comment' },
  },
  { timestamps: true }
);

const Comment = mongoose.model('Comment', commentSchema);
export default Comment;