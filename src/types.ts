import { Request } from 'express';

export interface TypeUser extends Request {
  user?: {
    _id: any;
  };
}
