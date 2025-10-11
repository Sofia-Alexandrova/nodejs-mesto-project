import { Request, Response, NextFunction } from 'express';
import { errorLogger } from '../middleware/logger';

export const logErrors = (err: Error, req: Request, res: Response, next: NextFunction) => {
  errorLogger.error({
    message: err.message,
    stack: err.stack,
    method: req.method,
    url: req.originalUrl,
    timestamp: new Date().toISOString(),
  });
  next(err);
};
