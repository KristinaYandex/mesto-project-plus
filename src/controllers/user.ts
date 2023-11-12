import { Request, Response, NextFunction } from 'express';
import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import User from '../models/user';
import { TypeUser } from '../types';
import {
  SUCCESSFUL_REQUEST_STATUS,
} from '../constants';
import ValidationError from '../errors/validation-error';
import UnauthorizedError from '../errors/unauthorized-error';
import NotFoundError from '../errors/not-found-error';
import ConflictError from '../errors/conflict-error';

type TUser = {
  name?: string;
  about?: string;
  avatar?: string;
};

type TUserId = string;

function updateUserProfile(userId: TUserId, data: TUser) {
  return User.findByIdAndUpdate(userId, data, {
    new: true,
  });
}

export const getUser = (req: TypeUser, res: Response, next: NextFunction) => {
  User.findById(req.user?._id)
    .then((user) => {
      if (user) {
        res.status(SUCCESSFUL_REQUEST_STATUS).send({ user });
      }
      next((new NotFoundError('Пользователь по указанному _id не найден')));
    })
    .catch((err) => next(err));
};

export const getUsers = (req: Request, res: Response, next: NextFunction) => {
  User.find({})
    .then((users) => res.status(SUCCESSFUL_REQUEST_STATUS).send({ data: users }))
    .catch((err) => next(err));
};

export const getUserById = (req: Request, res: Response, next: NextFunction) => {
  User.findById(req.params.id)
    .then((user) => {
      if (user) {
        res.status(SUCCESSFUL_REQUEST_STATUS).send({
          name: user.name,
          about: user.about,
          avatar: user.avatar,
          _id: user._id,
        });
      }
      next((new NotFoundError('Пользователь по указанному _id не найден')));
    })
    .catch((err) => next(err));
};

export const createUser = (req: Request, res: Response, next: NextFunction) => {
  const {
    name, about, avatar, email, password,
  } = req.body;

  return bcrypt.hash(password, 10)
    .then((hash: string) => User.create({
      name, about, avatar, email, password: hash,
    }))
    .then((user) => {
      res.status(201).send({
        email: user.email,
        name: user.name,
        about: user.about,
        avatar: user.avatar,
        _id: user._id,
      });
    })
    .catch((err) => {
      if (err.code === 11000) {
        next((new ConflictError('Пользователь с таким email уже существует')));
      }
      if (err instanceof mongoose.Error.ValidationError) {
        next((new ValidationError('Переданы некорректные данные при создании пользователя')));
      }
      next(err);
    });
};

export const updateUser = (req: TypeUser, res: Response, next: NextFunction) => {
  const { name, about } = req.body;

  return updateUserProfile(req.user?._id, { name, about })
    .then((user) => {
      if (user) {
        res.status(SUCCESSFUL_REQUEST_STATUS).send({ data: user });
      }
      next((new NotFoundError('Пользователь по указанному _id не найден')));
    })
    .catch((err) => {
      if (err instanceof mongoose.Error.ValidationError) {
        next((new ValidationError('Переданы некорректные данные при обновлении профиля пользователя')));
      }
      next(err);
    });
};

export const updateUserAvatar = (req: TypeUser, res: Response, next: NextFunction) => {
  const { avatar } = req.body;

  return updateUserProfile(req.user?._id, { avatar })
    .then((user) => {
      if (user) {
        res.status(SUCCESSFUL_REQUEST_STATUS).send({ data: user });
      }
      next((new NotFoundError('Пользователь по указанному _id не найден')));
    })
    .catch((err) => {
      if (err instanceof mongoose.Error.ValidationError) {
        next((new ValidationError('Переданы некорректные данные при обновлении аватара')));
      }
      next(err);
    });
};

export const login = (req: Request, res: Response, next: NextFunction) => {
  const { email, password } = req.body;

  return User.findUserByCredentials(email, password)
    .then((user) => {
      // создадим токен
      const token = jwt.sign({ _id: user._id }, 'some-secret-key', { expiresIn: '7d' });

      // вернём токен
      res.send({ token });
    })
    .catch(() => {
      next((new UnauthorizedError('Передан неверный логин или пароль')));
    });
};
