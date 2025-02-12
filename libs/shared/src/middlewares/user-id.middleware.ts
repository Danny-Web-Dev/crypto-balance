import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { ServerError } from '@app/shared/errors/server-error';
import ErrorType from '@app/shared/errors/error-type';

@Injectable()
export class UserIdMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: NextFunction) {
    const userId = req.headers['x-user-id'];
    if (!userId) {
      throw new ServerError(
        ErrorType.BAD_REQUEST.message,
        ErrorType.BAD_REQUEST.errorCode,
        'X-User-ID header is required',
      );
    }
    next();
  }
}
