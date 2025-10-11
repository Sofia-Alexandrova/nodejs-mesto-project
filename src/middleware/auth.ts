import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'some-secret-key';

interface JwtPayload {
  _id: string;
}

export const authMiddleware = (req: Request, _res: Response, next: NextFunction) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      const err = new Error('Необходима авторизация');
      (err as any).statusCode = 401;
      return next(err);
    }

    const token = authHeader.replace('Bearer ', '');

    const payload = jwt.verify(token, JWT_SECRET) as JwtPayload;

    (req as any).user = payload;

    next();
  } catch (err) {
    (err as any).statusCode = 401;
    next(err);
  }
};
