import Comment from '../models/Comment.js';
import Task from '../models/Task.js';
import { createBulkNotifications } from '../utils/createNotification.js';

// @desc    Add comment to task
// @route   POST /api/comments
// @access  Private
export const addComment = async (req, res, next) => {
  try {
    const { content, task: taskId, mentions = [], parentComment } = req.body;

    const task = await Task.findById(taskId);
    if (!task) return res.status(404).json({ success: false, message: 'Task not found' });

    const comment = await Comment.create({
      content,
      author: req.user._id,
      task: taskId,
      project: task.project,
      mentions,
      parentComment,
    });

    task.comments.push(comment._id);
    await task.save();

    const populated = await Comment.findById(comment._id)
      .populate('author', 'name email avatar')
      .populate('mentions', 'name avatar');

    const io = req.app.get('io');
    io.to(`task:${taskId}`).emit('comment:new', populated);

    // Notify mentions
    if (mentions.length > 0) {
      await createBulkNotifications(
        mentions,
        {
          sender: req.user._id,
          type: 'mention',
          title: 'You were mentioned',
          message: `${req.user.name} mentioned you in a comment`,
          link: `/tasks/${taskId}`,
          relatedTask: taskId,
          relatedProject: task.project,
        },
        io
      );
    }

    // Notify task assignees
    const recipients = task.assignees.filter(
      (a) => String(a) !== String(req.user._id) && !mentions.includes(String(a))
    );
    if (recipients.length > 0) {
      await createBulkNotifications(
        recipients,
        {
          sender: req.user._id,
          type: 'task_commented',
          title: 'New comment',
          message: `${req.user.name} commented on "${task.title}"`,
          link: `/tasks/${taskId}`,
          relatedTask: taskId,
          relatedProject: task.project,
        },
        io
      );
    }

    res.status(201).json({ success: true, comment: populated });
  } catch (error) {
    next(error);
  }
};

// @desc    Get comments for a task
// @route   GET /api/comments/task/:taskId
// @access  Private
export const getComments = async (req, res, next) => {
  try {
    const comments = await Comment.find({ task: req.params.taskId })
      .populate('author', 'name email avatar')
      .populate('mentions', 'name avatar')
      .sort({ createdAt: 1 });

    res.json({ success: true, count: comments.length, comments });
  } catch (error) {
    next(error);
  }
};

// @desc    Update comment
// @route   PUT /api/comments/:id
// @access  Private
export const updateComment = async (req, res, next) => {
  try {
    const comment = await Comment.findById(req.params.id);
    if (!comment) return res.status(404).json({ success: false, message: 'Comment not found' });

    if (String(comment.author) !== String(req.user._id)) {
      return res.status(403).json({ success: false, message: 'Not authorized' });
    }

    comment.content = req.body.content;
    comment.isEdited = true;
    await comment.save();

    const populated = await Comment.findById(comment._id).populate('author', 'name avatar');

    const io = req.app.get('io');
    io.to(`task:${comment.task}`).emit('comment:updated', populated);

    res.json({ success: true, comment: populated });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete comment
// @route   DELETE /api/comments/:id
// @access  Private
export const deleteComment = async (req, res, next) => {
  try {
    const comment = await Comment.findById(req.params.id);
    if (!comment) return res.status(404).json({ success: false, message: 'Comment not found' });

    if (String(comment.author) !== String(req.user._id) && req.user.role !== 'admin') {
      return res.status(403).json({ success: false, message: 'Not authorized' });
    }

    await Task.findByIdAndUpdate(comment.task, { $pull: { comments: comment._id } });
    await comment.deleteOne();

    const io = req.app.get('io');
    io.to(`task:${comment.task}`).emit('comment:deleted', { id: comment._id });

    res.json({ success: true, message: 'Comment deleted' });
  } catch (error) {
    next(error);
  }
};