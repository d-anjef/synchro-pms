import Task from '../models/Task.js';
import Project from '../models/Project.js';
import { createActivity } from '../utils/createActivity.js';
import { createBulkNotifications } from '../utils/createNotification.js';

// @desc    Create task
// @route   POST /api/tasks
// @access  Private
export const createTask = async (req, res, next) => {
  try {
    const project = await Project.findById(req.body.project);
    if (!project) return res.status(404).json({ success: false, message: 'Project not found' });

    const count = await Task.countDocuments({ project: req.body.project, status: req.body.status || 'todo' });

    const task = await Task.create({
      ...req.body,
      createdBy: req.user._id,
      position: count,
    });

    await createActivity({
      user: req.user._id,
      action: 'created_task',
      entityType: 'task',
      entityId: task._id,
      project: task.project,
      description: `${req.user.name} created task "${task.title}"`,
    });

    // Notify assignees
    if (task.assignees && task.assignees.length > 0) {
      const io = req.app.get('io');
      await createBulkNotifications(
        task.assignees.filter((a) => String(a) !== String(req.user._id)),
        {
          sender: req.user._id,
          type: 'task_assigned',
          title: 'New task assigned',
          message: `${req.user.name} assigned you to "${task.title}"`,
          link: `/tasks/${task._id}`,
          relatedTask: task._id,
          relatedProject: task.project,
        },
        io
      );
    }

    const populated = await Task.findById(task._id)
      .populate('createdBy', 'name email avatar')
      .populate('assignees', 'name email avatar')
      .populate('collaborators', 'name email avatar')
      .populate('attachments');

    // Realtime
    const io = req.app.get('io');
    io.to(`project:${task.project}`).emit('task:created', populated);

    res.status(201).json({ success: true, task: populated });
  } catch (error) {
    next(error);
  }
};

// @desc    Get tasks (filterable)
// @route   GET /api/tasks
// @access  Private
export const getTasks = async (req, res, next) => {
  try {
    const { project, status, priority, assignee, search, myTasks } = req.query;
    const query = { isArchived: false };

    if (project) query.project = project;
    if (status) query.status = status;
    if (priority) query.priority = priority;
    if (assignee) query.assignees = assignee;
    if (myTasks === 'true') query.assignees = req.user._id;
    if (search) query.title = { $regex: search, $options: 'i' };

    const tasks = await Task.find(query)
      .populate('createdBy', 'name avatar')
      .populate('assignees', 'name email avatar')
      .populate('project', 'name icon color')
      .populate('attachments')
      .sort({ position: 1, createdAt: -1 });

    res.json({ success: true, count: tasks.length, tasks });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single task
// @route   GET /api/tasks/:id
// @access  Private
export const getTaskById = async (req, res, next) => {
  try {
    const task = await Task.findById(req.params.id)
      .populate('createdBy', 'name email avatar')
      .populate('assignees', 'name email avatar jobTitle')
      .populate('collaborators', 'name email avatar')
      .populate('project', 'name icon color statusColumns')
      .populate('attachments')
      .populate({
        path: 'comments',
        populate: { path: 'author', select: 'name avatar' },
      });

    if (!task) return res.status(404).json({ success: false, message: 'Task not found' });

    res.json({ success: true, task });
  } catch (error) {
    next(error);
  }
};

// @desc    Update task
// @route   PUT /api/tasks/:id
// @access  Private
export const updateTask = async (req, res, next) => {
  try {
    const task = await Task.findById(req.params.id);
    if (!task) return res.status(404).json({ success: false, message: 'Task not found' });

    const fields = ['title', 'description', 'status', 'priority', 'progress',
      'dueDate', 'startDate', 'assignees', 'collaborators', 'tags', 'labels', 'isArchived'];

    const oldStatus = task.status;
    const oldAssignees = task.assignees.map(String);

    fields.forEach((f) => {
      if (req.body[f] !== undefined) task[f] = req.body[f];
    });

    if (req.body.status === 'completed' && oldStatus !== 'completed') {
      task.completedAt = new Date();
      task.progress = 100;
    }

    await task.save();

    await createActivity({
      user: req.user._id,
      action: 'updated_task',
      entityType: 'task',
      entityId: task._id,
      project: task.project,
      description: `${req.user.name} updated task "${task.title}"`,
    });

    // Notify newly added assignees
    const newAssignees = (req.body.assignees || []).filter(
      (a) => !oldAssignees.includes(String(a)) && String(a) !== String(req.user._id)
    );

    const io = req.app.get('io');
    if (newAssignees.length > 0) {
      await createBulkNotifications(
        newAssignees,
        {
          sender: req.user._id,
          type: 'task_assigned',
          title: 'Task assigned',
          message: `${req.user.name} assigned you to "${task.title}"`,
          link: `/tasks/${task._id}`,
          relatedTask: task._id,
          relatedProject: task.project,
        },
        io
      );
    }

    const populated = await Task.findById(task._id)
      .populate('createdBy', 'name avatar')
      .populate('assignees', 'name email avatar')
      .populate('collaborators', 'name email avatar')
      .populate('attachments');

    io.to(`project:${task.project}`).emit('task:updated', populated);

    res.json({ success: true, task: populated });
  } catch (error) {
    next(error);
  }
};

// @desc    Update task status (drag-drop)
// @route   PATCH /api/tasks/:id/status
// @access  Private
export const updateTaskStatus = async (req, res, next) => {
  try {
    const { status, position } = req.body;
    const task = await Task.findById(req.params.id);
    if (!task) return res.status(404).json({ success: false, message: 'Task not found' });

    task.status = status;
    if (position !== undefined) task.position = position;
    if (status === 'completed') {
      task.completedAt = new Date();
      task.progress = 100;
    }
    await task.save();

    const populated = await Task.findById(task._id)
      .populate('assignees', 'name avatar')
      .populate('attachments');

    const io = req.app.get('io');
    io.to(`project:${task.project}`).emit('task:status_changed', populated);

    res.json({ success: true, task: populated });
  } catch (error) {
    next(error);
  }
};

// @desc    Reorder tasks
// @route   PATCH /api/tasks/reorder
// @access  Private
export const reorderTasks = async (req, res, next) => {
  try {
    const { tasks } = req.body; // [{ id, position, status }]
    const bulk = tasks.map((t) => ({
      updateOne: {
        filter: { _id: t.id },
        update: { position: t.position, status: t.status },
      },
    }));
    await Task.bulkWrite(bulk);
    res.json({ success: true, message: 'Tasks reordered' });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete task
// @route   DELETE /api/tasks/:id
// @access  Private
export const deleteTask = async (req, res, next) => {
  try {
    const task = await Task.findById(req.params.id);
    if (!task) return res.status(404).json({ success: false, message: 'Task not found' });

    await task.deleteOne();

    const io = req.app.get('io');
    io.to(`project:${task.project}`).emit('task:deleted', { id: task._id });

    res.json({ success: true, message: 'Task deleted' });
  } catch (error) {
    next(error);
  }
};

// @desc    Add subtask
// @route   POST /api/tasks/:id/subtasks
// @access  Private
export const addSubtask = async (req, res, next) => {
  try {
    const task = await Task.findById(req.params.id);
    if (!task) return res.status(404).json({ success: false, message: 'Task not found' });

    task.subtasks.push({ title: req.body.title, createdBy: req.user._id });
    await task.save();
    res.json({ success: true, task });
  } catch (error) {
    next(error);
  }
};

// @desc    Toggle subtask
// @route   PATCH /api/tasks/:id/subtasks/:subId
// @access  Private
export const toggleSubtask = async (req, res, next) => {
  try {
    const task = await Task.findById(req.params.id);
    if (!task) return res.status(404).json({ success: false, message: 'Task not found' });

    const subtask = task.subtasks.id(req.params.subId);
    if (!subtask) return res.status(404).json({ success: false, message: 'Subtask not found' });

    subtask.completed = !subtask.completed;

    // Auto calc progress
    const total = task.subtasks.length;
    const done = task.subtasks.filter((s) => s.completed).length;
    if (total > 0) task.progress = Math.round((done / total) * 100);

    await task.save();
    res.json({ success: true, task });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete subtask
// @route   DELETE /api/tasks/:id/subtasks/:subId
// @access  Private
export const deleteSubtask = async (req, res, next) => {
  try {
    const task = await Task.findById(req.params.id);
    if (!task) return res.status(404).json({ success: false, message: 'Task not found' });

    task.subtasks.pull(req.params.subId);
    await task.save();
    res.json({ success: true, task });
  } catch (error) {
    next(error);
  }
};

// @desc    Get my tasks
// @route   GET /api/tasks/my-tasks
// @access  Private
export const getMyTasks = async (req, res, next) => {
  try {
    const tasks = await Task.find({
      assignees: req.user._id,
      isArchived: false,
    })
      .populate('project', 'name icon color')
      .populate('assignees', 'name avatar')
      .populate('attachments')
      .sort({ dueDate: 1, priority: -1 });

    res.json({ success: true, count: tasks.length, tasks });
  } catch (error) {
    next(error);
  }
};