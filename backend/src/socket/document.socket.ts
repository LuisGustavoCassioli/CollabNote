import { Server, Socket } from 'socket.io';

export const handleDocumentSockets = (io: Server, socket: Socket) => {
  // Ouve quando o cliente abre um documento e pede para entrar na sala
  socket.on('join_document', (documentId: string) => {
    socket.join(documentId);
    console.log(`[Socket] User ${socket.id} entrou no documento ${documentId}`);
  });

  // Ouve quando o cliente fecha o documento
  socket.on('leave_document', (documentId: string) => {
    socket.leave(documentId);
    console.log(`[Socket] User ${socket.id} saiu do documento ${documentId}`);
  });

  // Ouve atualizações de texto/dados de um cliente
  socket.on('send_changes', (data: { documentId: string; changes: any }) => {
    // Retransmite (broadcast) a mudança para TODOS na sala, exceto o remente
    socket.to(data.documentId).emit('receive_changes', data.changes);
  });
};
