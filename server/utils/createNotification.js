import Notification from '../models/Notification.js';

export const createNotification = async (
  {
    recipient,
    sender,
    type,
    title,
    message,
    link = '',
    relatedTask,
    relatedProject,
  },
  io = null
) => {
  try {
    if (String(sender) === String(recipient)) return null;

    const notification = await Notification.create({
      recipient,
      sender,
      type,
      title,
      message,
      link,
      relatedTask,
      relatedProject,
    });

    const populated = await Notification.findById(notification._id)
      .populate('sender', 'name avatar')
      .lean();

    // Emit realtime notification
    if (io) {
      io.to(`user:${recipient}`).emit('notification:new', populated);
    }

    return populated;
  } catch (err) {
    console.error('Notification error:', err.message);
  }
};

export const createBulkNotifications = async (recipients, payload, io = null) => {
  const results = [];
  for (const recipient of recipients) {
    const note = await createNotification({ ...payload, recipient }, io);
    if (note) results.push(note);
  }
  return results;
};