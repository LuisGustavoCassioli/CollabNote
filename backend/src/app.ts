import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import { createServer } from 'http';
import { Server } from 'socket.io';
import { authRoutes } from './routes/auth.routes';
import { documentRoutes } from './routes/document.routes';
import { errorMiddleware } from './middlewares/error.middleware';

const app = express();
const httpServer = createServer(app);
const io = new Server(httpServer, {
  cors: {
    origin: '*', // TODO: Atualizar com a URL do frontend em produção
    methods: ['GET', 'POST'],
  },
});

app.use(express.json());
app.use(cors());
app.use(helmet());
app.use(morgan('dev'));

// Rota de Health Check
app.get('/health', (req, res) => {
  res.json({ status: 'ok', message: 'CollabNote API is running' });
});

// Rotas da API
app.use('/api/auth', authRoutes);
app.use('/api/documents', documentRoutes);

// Middleware Global de Tratamento de Erros (sempre no fim)
app.use(errorMiddleware);

export { app, httpServer, io };
