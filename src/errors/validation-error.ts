import {
  BAD_REQUEST_STATUS,
} from '../constants';

class ValidationError extends Error {
  statusCode: number;

  constructor(message: string) {
    super(message);
    this.statusCode = BAD_REQUEST_STATUS;
  }
}

export default ValidationError;
