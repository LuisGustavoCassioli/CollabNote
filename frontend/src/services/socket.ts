import { io, Socket } from 'socket.io-client';

const SOCKET_URL = import.meta.env.VITE_API_URL || 'http://localhost:3333';

let socket: Socket | null = null;

export const getSocket = (): Socket | null => {
  return socket;
};

export const connectSocket = (token: string): Socket => {
  if (!socket) {
    socket = io(SOCKET_URL, {
      autoConnect: false,
      reconnection: true,
      transports: ['websocket'],
    });
  }
  
  socket.auth = { token };
  if (socket.disconnected) {
    socket.connect();
  }
  return socket;
};

export const disconnectSocket = () => {
  if (socket) {
    socket.disconnect();
    socket = null;
  }
};
