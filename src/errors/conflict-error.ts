import {
  CONFLICTING_REQUEST_STATUS,
} from '../constants';

class ConflictError extends Error {
  statusCode: number;

  constructor(message: string) {
    super(message);
    this.statusCode = CONFLICTING_REQUEST_STATUS;
  }
}

export default ConflictError;
