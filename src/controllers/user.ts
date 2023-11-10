import { Request, Response } from 'express';
import mongoose from 'mongoose';
import User from '../models/user';
import { TypeUser } from '../types';
import {
  SUCCESSFUL_REQUEST_STATUS, BAD_REQUEST_STATUS, NOT_FOUND_STATUS, INTERNAL_SERVER_ERROR_STATUS,
} from '../constants';

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

export const getUsers = (req: Request, res: Response) => {
  User.find({})
    .then((users) => res.status(SUCCESSFUL_REQUEST_STATUS).send({ data: users }))
    .catch(() => res.status(INTERNAL_SERVER_ERROR_STATUS).send({ message: 'На сервере произошла ошибка' }));
};

export const getUserById = (req: Request, res: Response) => {
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
      return res.status(NOT_FOUND_STATUS).send({ message: 'Пользователь по указанному _id не найден' });
    })
    .catch(() => res.status(INTERNAL_SERVER_ERROR_STATUS).send({ message: 'На сервере произошла ошибка' }));
};

export const createUser = (req: Request, res: Response) => {
  const { name, about, avatar } = req.body;

  User.create({ name, about, avatar })
    .then((user) => {
      res.status(SUCCESSFUL_REQUEST_STATUS).send({ data: user });
    })
    .catch((err) => {
      if (err instanceof mongoose.Error.ValidationError) {
        return res.status(BAD_REQUEST_STATUS).send({ message: 'Переданы некорректные данные при создании пользователя' });
      }
      return res.status(INTERNAL_SERVER_ERROR_STATUS).send({ message: 'На сервере произошла ошибка' });
    });
};

export const updateUser = (req: TypeUser, res: Response) => {
  const { name, about } = req.body;

  return updateUserProfile(req.user?._id, { name, about })
    .then((user) => {
      if (user) {
        res.status(SUCCESSFUL_REQUEST_STATUS).send({ data: user });
      }
      return res.status(NOT_FOUND_STATUS).send({ message: 'Пользователь c указанным _id не найден' });
    })
    .catch((err) => {
      if (err instanceof mongoose.Error.ValidationError) {
        return res.status(BAD_REQUEST_STATUS).send({ message: 'Переданы некорректные данные при обновлении профиля. ' });
      }
      return res.status(INTERNAL_SERVER_ERROR_STATUS).send({ message: 'На сервере произошла ошибка' });
    });
};

export const updateUserAvatar = (req: TypeUser, res: Response) => {
  const { avatar } = req.body;

  return updateUserProfile(req.user?._id, { avatar })
    .then((user) => {
      if (user) {
        res.status(SUCCESSFUL_REQUEST_STATUS).send({ data: user });
      }
      return res.status(NOT_FOUND_STATUS).send({ message: 'Пользователь c указанным _id не найден' });
    })
    .catch((err) => {
      if (err instanceof mongoose.Error.ValidationError) {
        return res.status(BAD_REQUEST_STATUS).send({ message: 'Переданы некорректные данные при обновлении аватара. ' });
      }
      return res.status(INTERNAL_SERVER_ERROR_STATUS).send({ message: 'На сервере произошла ошибка' });
    });
};
