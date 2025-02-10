const ErrorType = {
  GENERAL_ERROR: {
    id: 1,
    errorCode: 600,
    message: 'A general error ....',
    isShowStackTrace: true,
  },
  USER_ALREADY_EXIST: {
    id: 2,
    errorCode: 601,
    message: 'User already exist',
    isShowStackTrace: false,
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
  FAILED_TO_ADD_USER: {
    id: 6,
    errorCode: 602,
    message: 'Failed to add user',
    isShowStackTrace: false,
  },
  FAILED_TO_SEND_EMAIL: {
    id: 7,
    errorCode: 603,
    message: 'Failed to send email',
    isShowStackTrace: false,
  },
  FAILED_TO_CREATE_URL: {
    id: 8,
    errorCode: 604,
    message: 'Failed to create url',
    isShowStackTrace: false,
  },
  LINK_IS_NOT_ACTIVE: {
    id: 9,
    errorCode: 605,
    message: 'Link is not active',
    isShowStackTrace: false,
  },
  EMAIL_IS_NOT_VALIDATED: {
    id: 10,
    errorCode: 606,
    message: 'Please validate email',
    isShowStackTrace: false,
  },
  GOOGLE_MAIL_SERVICE_FAILURE: {
    id: 11,
    errorCode: 607,
    message: 'Unable to use google smtp service',
    isShowStackTrace: false,
  },
  FAILED_TO_UPDATE: {
    id: 12,
    errorCode: 608,
    message: 'Failed to update',
    isShowStackTrace: false,
  },
};

export default ErrorType;
