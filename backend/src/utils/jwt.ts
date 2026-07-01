import jwt from 'jsonwebtoken';

// TODO: Mover o default secret para um fallback seguro ou obrigar via env no futuro
const SECRET = process.env.JWT_SECRET || 'super-secret-key-for-dev';

export function generateToken(payload: object, expiresIn = '1d'): string {
  return jwt.sign(payload, SECRET, { expiresIn });
}

export function verifyToken(token: string) {
  return jwt.verify(token, SECRET);
}
