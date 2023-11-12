import { Request, Response, NextFunction } from 'express';
import mongoose from 'mongoose';
import Card from '../models/card';
import { TypeUser } from '../types';
import {
  SUCCESSFUL_REQUEST_STATUS,
} from '../constants';
import ValidationError from '../errors/validation-error';
import ForbiddenError from '../errors/forbidden-error';
import NotFoundError from '../errors/not-found-error';

export const getCards = (req: Request, res: Response, next: NextFunction) => {
  Card.find({})
    .then((cards) => res.status(SUCCESSFUL_REQUEST_STATUS).send({ data: cards }))
    .catch((err) => next(err));
};

export const createCard = (req: TypeUser, res: Response, next: NextFunction) => {
  const { name, link } = req.body;

  Card.create({ name, link, owner: req.user?._id })
    .then((card) => {
      res.status(SUCCESSFUL_REQUEST_STATUS).send({ data: card });
    })
    .catch((err) => {
      if (err instanceof mongoose.Error.ValidationError) {
        next((new ValidationError('Переданы некорректные данные при создании карточки')));
      }
      next(err);
    });
};

export const deleteCardById = (req: TypeUser, res: Response, next: NextFunction) => {
  Card.findByIdAndRemove(req.params.id)
    .then((card) => {
      if (!card) {
        throw new NotFoundError('Карточка по указанному ID не найдена');
      }
      if (card.owner.toString() !== req.user?._id) {
        next((new ForbiddenError('Попытка удалить чужую карточку')));
      }
      res.status(SUCCESSFUL_REQUEST_STATUS).send({ message: 'Карточка удалена' });
    })
    .catch((err) => next(err));
};

export const likeCard = (req: TypeUser, res: Response, next: NextFunction) => {
  Card.findByIdAndUpdate(req.params.cardId, { $addToSet: { likes: req.user?._id } }, { new: true })
    .then((card) => {
      if (card) {
        res.status(SUCCESSFUL_REQUEST_STATUS).send({ data: card });
      }
      next((new NotFoundError('Передан несуществующий _id карточки')));
    })
    .catch((err) => {
      if (err instanceof mongoose.Error.ValidationError) {
        next((new ValidationError('Переданы некорректные данные для постановки лайка')));
      }
      next(err);
    });
};

export const dislikeCard = (req: TypeUser, res: Response, next: NextFunction) => {
  Card.findByIdAndUpdate(req.params.cardId, { $pull: { likes: req.user?._id } }, { new: true })
    .then((card) => {
      if (card) {
        res.status(SUCCESSFUL_REQUEST_STATUS).send({ data: card });
      }
      next((new NotFoundError('Передан несуществующий _id карточки')));
    })
    .catch((err) => {
      if (err instanceof mongoose.Error.ValidationError) {
        next((new ValidationError('Переданы некорректные данные для удаления лайка')));
      }
      next(err);
    });
};
