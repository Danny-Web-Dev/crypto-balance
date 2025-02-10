export class ServerError extends Error {
  public readonly errorCode: number;
  public readonly additionalData?: unknown;

  constructor(message: string, errorCode: number, additionalData?: unknown) {
    super(message);
    this.errorCode = errorCode;
    this.additionalData = additionalData;

    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, this.constructor);
    }
  }
}
