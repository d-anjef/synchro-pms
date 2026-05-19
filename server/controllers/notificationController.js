import Notification from '../models/Notification.js';

// @desc    Get my notifications
// @route   GET /api/notifications
// @access  Private
export const getNotifications = async (req, res, next) => {
  try {
    const { isRead, limit = 50 } = req.query;
    const query = { recipient: req.user._id };
    if (isRead !== undefined) query.isRead = isRead === 'true';

    const notifications = await Notification.find(query)
      .populate('sender', 'name avatar')
      .sort({ createdAt: -1 })
      .limit(Number(limit));

    const unreadCount = await Notification.countDocuments({
      recipient: req.user._id,
      isRead: false,
    });

    res.json({ success: true, count: notifications.length, unreadCount, notifications });
  } catch (error) {
    next(error);
  }
};

// @desc    Mark notification as read
// @route   PATCH /api/notifications/:id/read
// @access  Private
export const markAsRead = async (req, res, next) => {
  try {
    const notification = await Notification.findOneAndUpdate(
      { _id: req.params.id, recipient: req.user._id },
      { isRead: true },
      { new: true }
    );
    if (!notification) {
      return res.status(404).json({ success: false, message: 'Notification not found' });
    }
    res.json({ success: true, notification });
  } catch (error) {
    next(error);
  }
};

// @desc    Mark all as read
// @route   PATCH /api/notifications/read-all
// @access  Private
export const markAllAsRead = async (req, res, next) => {
  try {
    await Notification.updateMany(
      { recipient: req.user._id, isRead: false },
      { isRead: true }
    );
    res.json({ success: true, message: 'All notifications marked as read' });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete notification
// @route   DELETE /api/notifications/:id
// @access  Private
export const deleteNotification = async (req, res, next) => {
  try {
    await Notification.findOneAndDelete({
      _id: req.params.id,
      recipient: req.user._id,
    });
    res.json({ success: true, message: 'Notification deleted' });
  } catch (error) {
    next(error);
  }
};

// @desc    Clear all notifications
// @route   DELETE /api/notifications/clear-all
// @access  Private
export const clearAll = async (req, res, next) => {
  try {
    await Notification.deleteMany({ recipient: req.user._id });
    res.json({ success: true, message: 'All notifications cleared' });
  } catch (error) {
    next(error);
  }
};