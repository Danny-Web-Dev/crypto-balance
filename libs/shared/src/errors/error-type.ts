const ErrorType = {
  GENERAL_ERROR: {
    id: 1,
    errorCode: 600,
    message: 'A general error ....',
  },
  BAD_REQUEST: {
    id: 3,
    errorCode: 400,
    message: 'Bad request',
  },
  UNAUTHORIZED: {
    id: 4,
    errorCode: 401,
    message: 'Unauthorized user',
  },
  USER_DOES_NOT_EXIST: {
    id: 5,
    errorCode: 601,
    message: 'User Does Not Exist',
  },
  FILE_NOT_FOUND: {
    id: 6,
    errorCode: 602,
    message: 'File not found.',
  },
};

export default ErrorType;
