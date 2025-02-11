export interface ResponseWrapper<T> {
  success: boolean;
  data: T;
  message?: string; // Optional: you can include a message, especially for common handling
  errorCode?: number; // Optional: common code for failures
}
