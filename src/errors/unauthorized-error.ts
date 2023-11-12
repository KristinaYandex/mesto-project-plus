import {
  UNAUTHORIZED_ERROR_STATUS,
} from '../constants';

class UnauthorizedError extends Error {
  statusCode: number;

  constructor(message: string) {
    super(message);
    this.statusCode = UNAUTHORIZED_ERROR_STATUS;
  }
}

export default UnauthorizedError;
