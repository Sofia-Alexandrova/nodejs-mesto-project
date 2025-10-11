import { NextFunction, Request, Response } from 'express';
import NotFoundError from '../errors/notFound';

const routeNotFound = (req: Request, res: Response, next: NextFunction) => {
  next(new NotFoundError('Запрашиваемый ресурс не найден.'));
};

export default routeNotFound;