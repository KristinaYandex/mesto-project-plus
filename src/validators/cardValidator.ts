import { celebrate, Joi } from 'celebrate';
import { urlRegex } from '../constants';

export const createCardValidation = celebrate({
  body: Joi.object().keys({
    name: Joi.string().required().min(2).max(30)
      .messages({
        'string.min': 'Минимальная длина поля "name" - 2 символа',
        'string.max': 'Максимальная длина поля "name" - 30 символов',
        'string.empty': 'Поле "name" должно быть заполнено',
      }),
    link: Joi.string().required().pattern(urlRegex)
      .message('Некорректный url')
      .messages({
        'string.empty': 'Поле "link" должно быть заполнено',
      }),
  }),
});

export const getCardByIdValidation = celebrate({
  params: Joi.object().keys({
    id: Joi.string().required().length(24).hex()
      .message('Некорректный id')
      .messages({
        'string.empty': 'Поле "id" должно быть заполнено',
      }),
  }),
});
