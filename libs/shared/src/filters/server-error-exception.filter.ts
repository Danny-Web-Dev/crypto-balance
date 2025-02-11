import { ExceptionFilter, Catch, ArgumentsHost } from '@nestjs/common';
import { Response } from 'express';
import { ServerError } from '@app/shared/errors/server-error';

@Catch(ServerError)
export class ServerErrorExceptionFilter implements ExceptionFilter {
  catch(exception: ServerError, host: ArgumentsHost) {
    const response = host.switchToHttp().getResponse<Response>();
    const statusCode = exception.errorCode || 500;

    response.status(statusCode).json({
      success: false,
      message: exception.message,
      errorCode: exception.errorCode,
    });
  }
}
