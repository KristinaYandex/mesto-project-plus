import {
  NOT_FOUND_STATUS,
} from '../constants';

class NotFoundError extends Error {
  statusCode: number;

  constructor(message: string) {
    super(message);
    this.statusCode = NOT_FOUND_STATUS;
  }
}

export default NotFoundError;
