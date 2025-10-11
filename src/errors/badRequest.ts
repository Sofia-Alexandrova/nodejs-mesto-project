import { constants } from 'http2';

export class BadRequestError extends Error {
  public statusCode = constants.HTTP_STATUS_BAD_REQUEST;
  public name = 'BadRequestError';

  constructor(message = 'Переданы некорректные данные') {
    super(message);
    Object.setPrototypeOf(this, BadRequestError.prototype); 
  }
}

export class ForbiddenError extends Error {
  public statusCode = constants.HTTP_STATUS_FORBIDDEN;
  public name = 'ForbiddenError';

  constructor(message = 'Нет прав доступа') {
    super(message);
    Object.setPrototypeOf(this, ForbiddenError.prototype);
  }
}
