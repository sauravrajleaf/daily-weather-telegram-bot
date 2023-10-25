import * as mongoose from 'mongoose';

export const UserSchema = new mongoose.Schema({
  chatId: String,
  city: String,
  isBlocked: Boolean,
  firstName: String,
  lastName: String,
  UserName: String,
});

export interface User extends mongoose.Document {
  chatId: string;
  city: string;
  isBlocked: boolean;
  firstName: string;
  lastName: string;
  UserName: string;
}

export const UserModel = mongoose.model<User>('User', UserSchema);
