import { celebrate, Joi } from 'celebrate';
import { urlRegex } from '../constants';

export const loginValidation = celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().email().messages({
      'string.empty': 'Поле "email" должно быть заполнено',
      'string.email': 'Некорректный email',
    }),
    password: Joi.string().required().messages({
      'string.empty': 'Поле "пароль" должно быть заполнено',
    }),
  }),
});

export const createUserValidation = celebrate({
  body: Joi.object().keys({
    name: Joi.string().min(2).max(30)
      .messages({
        'string.min': 'Минимальная длина поля "name" - 2 символа',
        'string.max': 'Максимальная длина поля "name" - 30 символов',
      }),
    about: Joi.string().min(2).max(200)
      .messages({
        'string.min': 'Минимальная длина поля "about" - 2 символа',
        'string.max': 'Максимальная длина поля "about" - 200 символов',
      }),
    avatar: Joi.string().pattern(urlRegex).message('Некорректный url'),
    email: Joi.string().required().email()
      .messages({
        'string.empty': 'Поле "email" должно быть заполнено',
        'string.email': 'Некорректный email',
      }),
    password: Joi.string().required()
      .messages({
        'string.empty': 'Поле "пароль" должно быть заполнено',
      }),
  }),
});

export const getUserByIdValidation = celebrate({
  params: Joi.object().keys({
    id: Joi.string().required().length(24).hex()
      .message('Некорректный id')
      .messages({
        'string.empty': 'Поле "id" должно быть заполнено',
      }),
  }),
});

export const updateUserProfileValidation = celebrate({
  body: Joi.object().keys({
    name: Joi.string().required().min(2).max(30)
      .messages({
        'string.min': 'Минимальная длина поля "name" - 2 символа',
        'string.max': 'Максимальная длина поля "name" - 30 символов',
        'string.empty': 'Поле "name" должно быть заполнено',
      }),
    about: Joi.string().required().min(2).max(200)
      .messages({
        'string.min': 'Минимальная длина поля "about" - 2 символа',
        'string.max': 'Максимальная длина поля "about" - 200 символов',
        'string.empty': 'Поле "about" должно быть заполнено',
      }),
  }),
});

export const updateUserAvatarValidation = celebrate({
  body: Joi.object().keys({
    avatar: Joi.string().required().pattern(urlRegex)
      .message('Некорректный url')
      .messages({
        'string.empty': 'Поле "avatar" должно быть заполнено',
      }),
  }),
});
