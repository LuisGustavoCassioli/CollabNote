import { app, httpServer, io } from './app';
import { setupSockets } from './socket';

const PORT = process.env.PORT || 3333;

// Boot da camada de tempo real (WebSockets)
setupSockets(io);

httpServer.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
