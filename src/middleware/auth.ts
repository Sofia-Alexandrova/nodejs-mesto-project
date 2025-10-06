import { Request, Response, NextFunction } from 'express';
import { AuthContext } from '../types/index';

export const authMiddleware = (req: Request, res: Response<unknown, AuthContext>, next: NextFunction) => {
  req.user = { _id: '68d5481e870d9eb87b8d7aed' };
  next();
};
