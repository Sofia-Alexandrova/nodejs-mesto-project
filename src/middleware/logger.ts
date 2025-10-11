import { createLogger, format, transports } from 'winston';
import path from 'path';

const jsonFormat = format.combine(
  format.timestamp(),
  format.errors({ stack: true }),
  format.splat(),
  format.json()
);

export const requestLogger = createLogger({
  level: 'info',
  format: jsonFormat,
  transports: [
    new transports.File({ filename: path.join('logs', 'request.log') }),
  ],
});

export const errorLogger = createLogger({
  level: 'error',
  format: jsonFormat,
  transports: [
    new transports.File({ filename: path.join('logs', 'error.log') }),
  ],
});
