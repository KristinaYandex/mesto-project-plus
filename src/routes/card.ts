import { Router } from 'express';
import {
  getCards, createCard, deleteCardById, likeCard, dislikeCard,
} from '../controllers/card';
import { createCardValidation, getCardByIdValidation } from '../validators/cardValidator';

const cardRouter = Router();

cardRouter.get('/cards', getCards);
cardRouter.post('/cards', createCardValidation, createCard);
cardRouter.delete('/cards/:cardId', getCardByIdValidation, deleteCardById);
cardRouter.put('/cards/:cardId/likes', getCardByIdValidation, likeCard);
cardRouter.delete('/cards/:cardId/likes', getCardByIdValidation, dislikeCard);

export default cardRouter;
