import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'some-secret-key';

interface JwtPayload {
  _id: string;
}

export const authMiddleware = (req: Request, res: Response, next: NextFunction) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ message: 'Необходима авторизация' });
    }

    const token = authHeader.replace('Bearer ', '');

    const payload = jwt.verify(token, JWT_SECRET) as JwtPayload;

    (req as any).user = payload;

    next();
  } catch (err) {
    return res.status(401).json({ message: 'Необходима авторизация' });
  }
};
