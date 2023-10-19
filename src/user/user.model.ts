import * as mongoose from 'mongoose';

export const UserSchema = new mongoose.Schema({
  chatId: String,
  city: String,
});

export interface User extends mongoose.Document {
  chatId: string;
  city: string;
}

export const UserModel = mongoose.model<User>('User', UserSchema);
