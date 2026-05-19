import jwt from 'jsonwebtoken';
import User from '../models/User.js';

const onlineUsers = new Map(); // userId -> socketId

export const initializeSocket = (io) => {
  // Auth middleware
  io.use(async (socket, next) => {
    try {
      const token =
        socket.handshake.auth?.token ||
        socket.handshake.headers?.authorization?.split(' ')[1];

      if (!token) return next(new Error('Authentication required'));

      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      const user = await User.findById(decoded.id).select('name email avatar');
      if (!user) return next(new Error('User not found'));

      socket.user = user;
      next();
    } catch (err) {
      next(new Error('Invalid token'));
    }
  });

  io.on('connection', async (socket) => {
    const userId = socket.user._id.toString();
    console.log(`🟢 Socket connected: ${socket.user.name} (${socket.id})`);

    // Track online users
    onlineUsers.set(userId, socket.id);
    socket.join(`user:${userId}`);

    await User.findByIdAndUpdate(userId, { isOnline: true });

    // Broadcast online users
    io.emit('users:online', Array.from(onlineUsers.keys()));

    // Join project room
    socket.on('project:join', (projectId) => {
      socket.join(`project:${projectId}`);
    });

    socket.on('project:leave', (projectId) => {
      socket.leave(`project:${projectId}`);
    });

    // Join task room (for comments)
    socket.on('task:join', (taskId) => {
      socket.join(`task:${taskId}`);
    });

    socket.on('task:leave', (taskId) => {
      socket.leave(`task:${taskId}`);
    });

    // Typing indicator
    socket.on('typing:start', ({ taskId }) => {
      socket.to(`task:${taskId}`).emit('typing:start', {
        userId,
        name: socket.user.name,
      });
    });

    socket.on('typing:stop', ({ taskId }) => {
      socket.to(`task:${taskId}`).emit('typing:stop', { userId });
    });

    // Disconnect
    socket.on('disconnect', async () => {
      console.log(`🔴 Socket disconnected: ${socket.user.name}`);
      onlineUsers.delete(userId);
      await User.findByIdAndUpdate(userId, {
        isOnline: false,
        lastSeen: new Date(),
      });
      io.emit('users:online', Array.from(onlineUsers.keys()));
    });
  });
};