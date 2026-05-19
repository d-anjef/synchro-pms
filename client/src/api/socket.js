import { io } from 'socket.io-client';
import { SOCKET_URL } from '../utils/constants';

let socket = null;

export const initSocket = (token) => {
  if (socket?.connected) return socket;

  socket = io(SOCKET_URL, {
    auth: { token },
    transports: ['websocket', 'polling'],
    withCredentials: true,
  });

  socket.on('connect', () => console.log('🟢 Socket connected:', socket.id));
  socket.on('disconnect', () => console.log('🔴 Socket disconnected'));
  socket.on('connect_error', (err) => console.error('Socket error:', err.message));

  return socket;
};

export const getSocket = () => socket;

export const disconnectSocket = () => {
  if (socket) {
    socket.disconnect();
    socket = null;
  }
};