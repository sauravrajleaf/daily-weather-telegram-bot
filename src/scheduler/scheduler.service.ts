import { Injectable, Inject } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';
import { TelegramBotService } from 'src/telegram-bot/telegram-bot.service';
import { WeatherService } from 'src/weather/weather.service';
require('dotenv').config();
const axios = require('axios');

const GET_USER_URL = `${process.env.URL}/user/getUser`;

@Injectable()
export class SchedulerService {
  constructor(
    private readonly telegramService: TelegramBotService,
    private readonly weatherService: WeatherService,
  ) {}

  //   In this cron expression:
  // * in the first field means every minute.
  // * in the second field means every hour.
  // * in the third field means every day of the month.
  // * in the fourth field means every month.
  // * in the fifth field means every day of the week.
  // * in the sixth field means every second within the minute.
  @Cron('0 0 * * *') // This cron job at 6 am every morning
  async sendWeatherNotifications() {
    //Steps
    //1. Get the list of subscribed users /user/getUsers
    //2. Loop the array of users and send scheduled weather notifications
    // console.log('GET_USER_URL', GET_USER_URL);
    const userList = await axios.get(GET_USER_URL);
    const allUsers = userList.data;

    for (const user of allUsers) {
      console.log('user', user);
      const sendWeatherDetails = await this.weatherService.getWeather(
        user.city,
        user.chatId,
      );
    }
    return;
  }
}
