import express, { NextFunction, Response } from 'express';
import mongoose from 'mongoose';
import userRouter from './routes/user';
import cardRouter from './routes/card';
import { TypeUser } from './types';

const app = express();

const { port = 3000, MONGO_URL = 'mongodb://127.0.0.1:27017/mestodb' } = process.env;

app.use(express.json());

app.use((req: TypeUser, res: Response, next: NextFunction) => {
  req.user = {
    _id: '5d8b8592978f8bd833ca8133',
  };
  next();
});

app.use(userRouter);
app.use(cardRouter);

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
