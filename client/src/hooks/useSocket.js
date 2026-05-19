import { useEffect } from 'react';
import { getSocket } from '../api/socket';

export const useSocket = (event, handler, deps = []) => {
  useEffect(() => {
    const socket = getSocket();
    if (!socket) return;
    socket.on(event, handler);
    return () => socket.off(event, handler);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);
};