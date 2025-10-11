import { Request, Response, NextFunction } from 'express';
import { requestLogger } from '../middleware/logger';

export const logRequests = (req: Request, res: Response, next: NextFunction) => {
  requestLogger.info({
    method: req.method,
    url: req.originalUrl,
    headers: req.headers,
    body: req.body,
    timestamp: new Date().toISOString(),
  });
  next();
};
