import express from 'express';
import { errors } from 'celebrate';
import mongoose from 'mongoose';
import userRouter from './routes/user';
import cardRouter from './routes/card';
import auth from './middlewares/auth';
import errorHandler from './middlewares/errorHandler';
import {
  requestLogger, errorLogger,
} from './middlewares/logger';
import {
  login, createUser,
} from './controllers/user';
import { loginValidation, createUserValidation } from './validators/userValidator';

const app = express();

const { port = 3000, MONGO_URL = 'mongodb://127.0.0.1:27017/mestodb' } = process.env;

app.use(express.json());

app.use(requestLogger); // подключаем логер запросов

app.post('/signup', createUserValidation, createUser);
app.post('/signin', loginValidation, login);

app.use(auth); // защищаем все роуты кроме страницы регистрации и логина

app.use(userRouter);
app.use(cardRouter);

app.use(errorLogger); // подключаем логер ошибок

app.use(errors()); // обработчик ошибок celebrate

app.use(errorHandler); // централизованный обработчик ошибок

async function connect() {
  try {
    mongoose.set('strictQuery', true);
    await mongoose.connect(MONGO_URL);
    console.log('База данных подключена');
    await app.listen(port);
    console.log(`Сервер запущен на порту: ${port}`);
  } catch (err) {
    console.log('Ошибка на стороне сервера', err);
  }
}

connect();
