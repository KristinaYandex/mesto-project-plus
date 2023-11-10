import { Router } from 'express';
import {
  getUsers, getUserById, createUser, updateUser, updateUserAvatar,
} from '../controllers/user';

const userRouter = Router();

userRouter.get('/users', getUsers);
userRouter.get('/users/:userId', getUserById);
userRouter.post('/users', createUser);
userRouter.patch('/users/me', updateUser);
userRouter.patch('/users/me/avatar', updateUserAvatar);

export default userRouter;
