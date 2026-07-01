import { Request, Response, NextFunction } from 'express';
import { AppError } from '../errors/app-error';
import { verifyToken } from '../utils/jwt';

export const authMiddleware = (req: Request, res: Response, next: NextFunction) => {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    throw new AppError('Token JWT não fornecido.', 401);
  }

  const [, token] = authHeader.split(' ');

  if (!token) {
    throw new AppError('Token JWT mal formatado.', 401);
  }

  try {
    const decoded = verifyToken(token) as { id: string };
    req.user = { id: decoded.id };
    return next();
  } catch (error) {
    throw new AppError('Token JWT inválido ou expirado.', 401);
  }
};
