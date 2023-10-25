import { Injectable, Inject } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import mongoose from 'mongoose';
import { User } from './user.model';
import { TelegramBotService } from 'src/telegram-bot/telegram-bot.service';

@Injectable()
export class UserService {
  constructor(
    @InjectModel('User') private readonly userModel: Model<User>,
    @Inject(TelegramBotService)
    private readonly telegramService: TelegramBotService,
  ) {}

  async createUser(userDto: any): Promise<User> {
    try {
      console.log('userDto', userDto);
      const chatId = userDto.chatId;
      const city = userDto.city;
      const user = await this.userModel.findOne({ chatId }).exec();

      //check if user exists
      if (user) {
        console.log('User already exists');
        const userId = user._id;
        const currCity = user.city;
        //check if user exists with the same city details
        if (user.city === userDto.city) {
          this.telegramService.sendMessageToUser(
            chatId,
            'User already subscribed with same city!',
          );
          return user;
        } else {
          //if new city is passed update the city details
          const updatedUser = await this.userModel.findOneAndUpdate(
            { _id: new mongoose.Types.ObjectId(userId) },
            { $set: { city } },
            { new: true },
          );
          this.telegramService.sendMessageToUser(
            chatId,
            `User already subscribed! City Updated form ${currCity} ✈️ ${city}`,
          );
          return updatedUser;
        }
      }

      console.log('New user register');
      const createdUser = new this.userModel(userDto);
      await createdUser.save();
      this.telegramService.sendMessageToUser(
        chatId,
        `User subscribed for daily weather report for ${city}!`,
      );
    } catch (error) {
      throw new Error('Subscribing Failed');
    }
  }

  async getAllUserList(): Promise<any> {
    const allUsers = await this.userModel.find().exec();
    // console.log('allUsers', allUsers);
    return allUsers;
  }

  async blockOrUpdateUser(userDto: any): Promise<User> {
    console.log('I am blockOrUpdateUser');
    return;
  }

  async unsubscribeUser({ chatId }): Promise<User> {
    this.telegramService.sendMessageToUser(chatId, 'Unsubscribing user');

    try {
      // Find the user in the database
      const user = await this.userModel.findOne({ chatId });

      if (user) {
        // If user found, delete the user from the database
        await this.userModel.findOneAndDelete({ chatId });
        this.telegramService.sendMessageToUser(
          chatId,
          'User unsubscribed successfully',
        );
        return user;
      } else {
        this.telegramService.sendMessageToUser(chatId, 'User not found');
        return null;
      }
    } catch (error) {
      console.error('Error unsubscribing user:', error);
      throw error;
    }
  }
}
