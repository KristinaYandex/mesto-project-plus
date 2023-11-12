import { Router } from 'express';
import {
  getUser, getUsers, getUserById, updateUser, updateUserAvatar,
} from '../controllers/user';
import { getUserByIdValidation, updateUserProfileValidation, updateUserAvatarValidation } from '../validators/userValidator';

const userRouter = Router();

userRouter.get('/users/me', getUser);
userRouter.get('/users', getUsers);
userRouter.get('/users/:userId', getUserByIdValidation, getUserById);
userRouter.patch('/users/me', updateUserProfileValidation, updateUser);
userRouter.patch('/users/me/avatar', updateUserAvatarValidation, updateUserAvatar);

export default userRouter;
