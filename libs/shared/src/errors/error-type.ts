const ErrorType = {
  INTERNAL_SERVER_ERROR: {
    id: 1,
    errorCode: 500,
    message: 'Internal server error',
  },
  BAD_REQUEST: {
    id: 2,
    errorCode: 400,
    message: 'Bad request',
  },
  USER_DOES_NOT_EXIST: {
    id: 3,
    errorCode: 601,
    message: 'User Does Not Exist',
  },
  UNABLE_TO_WRITE_TO_FILE: {
    id: 4,
    errorCode: 603,
    message: 'Unable to write to file.',
  },
  UNABLE_TO_READ_FILE: {
    id: 5,
    errorCode: 604,
    message: 'Unable to read file.',
  },
  ASSET_NOT_FOUND: {
    id: 6,
    errorCode: 607,
    message: 'Asset not found.',
  },
};

export default ErrorType;
