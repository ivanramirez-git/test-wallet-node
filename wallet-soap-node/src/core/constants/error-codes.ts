export const ErrorCodes = {
  SUCCESS: '00',
  VALIDATION_ERROR: '01',
  USER_EXISTS: '02',
  USER_NOT_FOUND: '03',
  INSUFFICIENT_FUNDS: '04',
  INVALID_TOKEN: '05',
  SESSION_EXPIRED: '06',
  INVALID_CREDENTIALS: '07',
  EMAIL_SEND_FAILED: '08',
  DATABASE_ERROR: '09',
  UNAUTHORIZED: '10',
  INITIAL_BALANCE_REQUIRED: '11',
} as const;

export const ErrorMessages = {
  [ErrorCodes.SUCCESS]: 'Operation successful',
  [ErrorCodes.VALIDATION_ERROR]: 'Validation error',
  [ErrorCodes.USER_EXISTS]: 'User already exists',
  [ErrorCodes.USER_NOT_FOUND]: 'User not found',
  [ErrorCodes.INSUFFICIENT_FUNDS]: 'Insufficient funds',
  [ErrorCodes.INVALID_TOKEN]: 'Invalid token',
  [ErrorCodes.SESSION_EXPIRED]: 'Session expired',
  [ErrorCodes.INVALID_CREDENTIALS]: 'Invalid credentials',
  [ErrorCodes.EMAIL_SEND_FAILED]: 'Failed to send email',
  [ErrorCodes.DATABASE_ERROR]: 'Database error',
  [ErrorCodes.UNAUTHORIZED]: 'Unauthorized access',
  [ErrorCodes.INITIAL_BALANCE_REQUIRED]: 'Initial balance required',
};