import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User } from './user.model';

@Injectable()
export class UserService {
  constructor(@InjectModel('User') private readonly userModel: Model<User>) {}
  async createUser(userDto: any): Promise<User> {
    try {
      console.log('i am in user service');
      const createdUser = new this.userModel(userDto);
      return createdUser.save();
    } catch (error) {
      throw new Error('Subscribing Failed');
    }
  }
  // async getUsers(): Promise<User[]> {
  //   return this.userModel.find().exec();
  // }
}
