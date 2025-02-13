const ErrorType = {
  GENERAL_ERROR: {
    id: 1,
    errorCode: 600,
    message: 'A general common ....',
  },
  INTERNAL_SERVER_ERROR: {
    id: 2,
    errorCode: 500,
    message: 'Internal server error',
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
  UNABLE_TO_WRITE_TO_FILE: {
    id: 7,
    errorCode: 603,
    message: 'Unable to write to file.',
  },
  UNABLE_TO_READ_FILE: {
    id: 8,
    errorCode: 604,
    message: 'Unable to read file.',
  },
  UNABLE_TO_FETCH_DATA: {
    id: 9,
    errorCode: 605,
    message: 'Unable to fetch data.',
  },
  MISSING_PARAMS: {
    id: 10,
    errorCode: 606,
    message: 'Parameters are missing.',
  },
  ASSET_NOT_FOUND: {
    id: 11,
    errorCode: 607,
    message: 'Asset not found.',
  },

};

export default ErrorType;
