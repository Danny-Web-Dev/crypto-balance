const ErrorType = {
  GENERAL_ERROR: {
    id: 1,
    errorCode: 600,
    message: 'A general error ....',
    isShowStackTrace: true,
  },
  BAD_REQUEST: {
    id: 3,
    errorCode: 400,
    message: 'Bad request',
    isShowStackTrace: false,
  },
  UNAUTHORIZED: {
    id: 4,
    errorCode: 401,
    message: 'Unauthorized user',
    isShowStackTrace: false,
  },
  USER_DOES_NOT_EXIST: {
    id: 5,
    errorCode: 601,
    message: 'User Does Not Exist',
    isShowStackTrace: true,
  },
};

export default ErrorType;
