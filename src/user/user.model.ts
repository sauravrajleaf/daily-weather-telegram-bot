import * as mongoose from 'mongoose';

export const UserSchema = new mongoose.Schema({
  chatId: String,
});

export interface User extends mongoose.Document {
  chatId: string;
}

export const UserModel = mongoose.model<User>('User', UserSchema);
