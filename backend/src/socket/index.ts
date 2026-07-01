import { Server } from 'socket.io';
import { handleDocumentSockets } from './document.socket';

export const setupSockets = (io: Server) => {
  io.on('connection', (socket) => {
    console.log(`[Socket] Nova conexão estabelecida: ${socket.id}`);

    // Inicializa todos os sub-módulos de eventos WebSockets para esta conexão
    handleDocumentSockets(io, socket);

    socket.on('disconnect', () => {
      console.log(`[Socket] Conexão encerrada: ${socket.id}`);
    });
  });
};
