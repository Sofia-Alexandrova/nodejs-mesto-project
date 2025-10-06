import { ErrorRequestHandler } from 'express';
import mongoose from 'mongoose';
import { constants } from 'http2';

const errorHandler: ErrorRequestHandler = (err, _req, res, next) => {
  if (err instanceof mongoose.Error.ValidationError) {
    return res.status(400).json({ message: err.message || 'Переданы некорректные данные.' });
  }

  if (err instanceof mongoose.Error.CastError) {
    return res.status(400).json({ message: 'Передан некорректный _id.' });
  }

  const statusCode =
    typeof err.statusCode === 'number' ? err.statusCode :
    typeof err.status === 'number' ? err.status :
    constants.HTTP_STATUS_INTERNAL_SERVER_ERROR;

  const message =
    statusCode === constants.HTTP_STATUS_INTERNAL_SERVER_ERROR
      ? 'Ошибка сервера.'
      : err.message || 'Произошла ошибка.';

  return res.status(statusCode).json({ message });
};

export default errorHandler;
