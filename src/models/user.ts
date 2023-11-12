import mongoose, { Model, Document } from 'mongoose';
import bcrypt from 'bcryptjs';
import validator from 'validator';
import { urlRegex } from '../constants';

interface IUser {
  name: string;
  about: string;
  avatar: string;
  email: string;
  password: string;
}
interface UserModel extends Model<IUser> {
  findUserByCredentials:
  // eslint-disable-next-line no-unused-vars
  (email: string, password: string) => Promise<Document<unknown, any, IUser>>
}

const userSchema = new mongoose.Schema<IUser>({
  name: {
    type: String,
    minlength: 2,
    maxlength: 30,
    required: true,
    default: 'Жак-Ив Кусто',
  },
  about: {
    type: String,
    minlength: 2,
    maxlength: 200,
    required: true,
    default: 'Исследователь',
  },
  avatar: {
    type: String,
    required: true,
    default: 'https://pictures.s3.yandex.net/resources/jacques-cousteau_1604399756.png',
    validate: { // опишем свойство validate
      validator: (v: string) => urlRegex.test(v),
      message: 'Некорректный url', // выводится в случае false
    },
  },
  email: {
    type: String,
    unique: true,
    required: true,
    validate: { // опишем свойство validate
      validator: (v: string) => validator.isEmail(v),
      message: 'Некорректный email', // выводится в случае false
    },
  },
  password: {
    type: String,
    required: true,
    select: false, // API не будет возвращать хеш пароля
  },
});

userSchema.static('findUserByCredentials', function findUserByCredentials(email: string, password: string) {
  return this.findOne({ email }).select('+password')
    .then((user: any) => {
      if (!user) {
        return Promise.reject(new Error('Неправильные почта или пароль'));
      }

      return bcrypt.compare(password, user.password)
        .then((matched) => {
          if (!matched) {
            return Promise.reject(new Error('Неправильные почта или пароль'));
          }
          return user; // теперь user доступен
        });
    });
});

export default mongoose.model<IUser, UserModel>('user', userSchema);
