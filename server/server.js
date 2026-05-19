import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import morgan from 'morgan';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import { createServer } from 'http';
import { Server } from 'socket.io';
import subscriptionRoutes from './routes/subscriptionRoutes.js';
import { handleWebhook } from './controllers/subscriptionController.js';

import connectDB from './config/db.js';
import { notFound, errorHandler } from './middleware/errorMiddleware.js';
import { initializeSocket } from './sockets/socketHandler.js';

// Routes
import authRoutes from './routes/authRoutes.js';
import userRoutes from './routes/userRoutes.js';
import projectRoutes from './routes/projectRoutes.js';
import taskRoutes from './routes/taskRoutes.js';
import commentRoutes from './routes/commentRoutes.js';
import teamRoutes from './routes/teamRoutes.js';
import notificationRoutes from './routes/notificationRoutes.js';
import fileRoutes from './routes/fileRoutes.js';
import activityRoutes from './routes/activityRoutes.js';
import analyticsRoutes from './routes/analyticsRoutes.js';
import adminRoutes from './routes/adminRoutes.js';
import paymentRoutes from './routes/paymentRoutes.js';

dotenv.config();
connectDB();

const app = express();
const httpServer = createServer(app);

// Socket.IO
const io = new Server(httpServer, {
  cors: {
    origin: process.env.CLIENT_URL || 'http://localhost:5173',
    credentials: true,
  },
});
app.set('io', io);
initializeSocket(io);

// ===== Middleware =====
app.use(helmet({ crossOriginResourcePolicy: false }));

// Stripe webhook needs raw body — must come BEFORE express.json()
app.post(
  '/api/subscription/webhook',
  express.raw({ type: 'application/json' }),
  handleWebhook
);

app.use(
  cors({
    origin: process.env.CLIENT_URL || 'http://localhost:5173',
    credentials: true,
  })
);
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));
app.use(cookieParser());

if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 500,
  message: 'Too many requests, please try again later.',
});
app.use('/api', limiter);

// ===== Health =====
app.get('/', (req, res) => {
  res.json({
    success: true,
    message: '🚀 Synchro PMS API is running',
    version: '1.0.0',
  });
});

app.get('/api/health', (req, res) => {
  res.json({ success: true, status: 'healthy', timestamp: new Date() });
});

// ===== Mount Routes =====
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/projects', projectRoutes);
app.use('/api/tasks', taskRoutes);
app.use('/api/comments', commentRoutes);
app.use('/api/teams', teamRoutes);
app.use('/api/notifications', notificationRoutes);
app.use('/api/files', fileRoutes);
app.use('/api/activities', activityRoutes);
app.use('/api/analytics', analyticsRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/subscription', subscriptionRoutes);
app.use('/api/payment', paymentRoutes);

// ===== Error Handling =====
app.use(notFound);
app.use(errorHandler);

// ===== Start Server =====
const PORT = process.env.PORT || 5000;
httpServer.listen(PORT, () => {
  console.log(`🚀 Server running in ${process.env.NODE_ENV} mode on port ${PORT}`);
});

process.on('unhandledRejection', (err) => {
  console.error(`❌ Unhandled Rejection: ${err.message}`);
  httpServer.close(() => process.exit(1));
});