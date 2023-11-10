import express, { NextFunction, Response } from 'express';
import mongoose from 'mongoose';
import userRouter from './routes/user';
import cardRouter from './routes/card';
import { TypeUser } from './types';

const app = express();
const port = 3000;

mongoose.connect('mongodb://127.0.0.1:27017/mestodb');

app.use(express.json());

app.use(userRouter);
app.use(cardRouter);

app.use((req: TypeUser, res: Response, next: NextFunction) => {
  req.user = {
    _id: '5d8b8592978f8bd833ca8133',
  };
  next();
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
