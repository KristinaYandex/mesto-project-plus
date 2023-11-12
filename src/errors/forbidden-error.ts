import {
  FORBIDDEN_ERROR_STATUS,
} from '../constants';

class ForbiddenError extends Error {
  statusCode: number;

  constructor(message: string) {
    super(message);
    this.statusCode = FORBIDDEN_ERROR_STATUS;
  }
}

export default ForbiddenError;
