import * as mongoose from 'mongoose';

export const UserSchema = new mongoose.Schema({
  chatId: String,
  city: String,
  isBlocked: Boolean,
});

export interface User extends mongoose.Document {
  chatId: string;
  city: string;
  isBlocked: boolean;
}

export const UserModel = mongoose.model<User>('User', UserSchema);
