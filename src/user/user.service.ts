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
      const chatId = userDto.chatId;
      const city = userDto.city;
      const user = await this.userModel.findOne({ chatId }).exec();
      const userId = user._id;
      const currCity = user.city;
      console.log(user);

      //check if user exists
      if (user) {
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
      const createdUser = new this.userModel(userDto);
      return createdUser.save();
    } catch (error) {
      throw new Error('Subscribing Failed');
    }
  }
}
