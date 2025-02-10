import { Request, Response, NextFunction } from 'express';

interface WrappedResponse<T> {
  success: boolean;
  data: T | { message: string; errorCode: number };
}

export const wrapResponse = (
  req: Request,
  res: Response,
  next: NextFunction,
): void => {
  const originalJson = res.json;
  res.json = function (body: any) {
    let wrappedBody: WrappedResponse<typeof body>;

    body = body || {};

    if (!body.errorCode) {
      wrappedBody = {
        success: true,
        data: body,
      };
    } else {
      const message = body.additionalData ? `${body.message} ${body.additionalData}` : body.message || 'An error occurred';

      wrappedBody = {
        success: false,
        data: {
          message: message,
        },
      };

      if (body.errorCode >= 400 && body.errorCode < 600) {
        res.statusCode = body.errorCode;
      } else {
        wrappedBody.data.errorCode = body.errorCode;
      }
    }

    return originalJson.call(this, wrappedBody);
  };

  next();
};
