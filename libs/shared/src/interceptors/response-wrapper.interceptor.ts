import { Injectable, NestInterceptor, ExecutionContext, CallHandler } from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Response } from 'express';

interface WrappedResponse<T> {
  success: boolean;
  data: T | {};
}

@Injectable()
export class ResponseWrapperInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    return next.handle().pipe(
      map((data) => {
        // Check if the response data is undefined (i.e., void) or empty
        if (data === undefined) {
          data = {};
        }

        // Wrap the success responses with the required structure
        return {
          success: true,
          data: data,
        };
      }),
    );
  }
}
