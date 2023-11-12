import { Request, Response, NextFunction } from 'express';
import jwt, { JwtPayload } from 'jsonwebtoken';
import {
  UNAUTHORIZED_ERROR_STATUS,
} from '../constants';

interface SessionRequest extends Request {
  user?: string | JwtPayload;
}

const { JWT_SECRET = '9a5f1c75e461d7ceb1cf3cab9013eb2dc85b6d0da8c3c6e27e3a5a5b3faa5bab' } = process.env;

export default (req: SessionRequest, res: Response, next: NextFunction) => {
  const { authorization } = req.headers;

  if (!authorization || !authorization.startsWith('Bearer ')) {
    return res.status(UNAUTHORIZED_ERROR_STATUS).send({ message: 'Передан неверный логин или пароль' });
  }

  const token = authorization.replace('Bearer ', '');
  let payload;

  try {
    payload = jwt.verify(token, JWT_SECRET as string);
  } catch (err) {
    return res.status(UNAUTHORIZED_ERROR_STATUS).send({ message: 'Передан неверный логин или пароль' });
  }

  req.user = payload; // записываем пейлоуд в объект запроса

  return next(); // пропускаем запрос дальше
};
