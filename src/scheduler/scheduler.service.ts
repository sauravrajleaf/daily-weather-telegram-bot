import { Injectable, Inject } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';
import { TelegramBotService } from 'src/telegram-bot/telegram-bot.service';
@Injectable()
export class SchedulerService {
  constructor(
    @Inject(TelegramBotService)
    private readonly telegramService: TelegramBotService,
  ) {}

  //   In this cron expression:
  // * in the first field means every minute.
  // * in the second field means every hour.
  // * in the third field means every day of the month.
  // * in the fourth field means every month.
  // * in the fifth field means every day of the week.
  // * in the sixth field means every second within the minute.
  @Cron('0 9 * * * *') // This cron job runs every day at 9:00 AM
  async sendWeatherNotifications() {
    const chatId = '1013100688';
    this.telegramService.sendMessageToUser(chatId, `Scheduler Activated`);
    //Steps
    //1. Get the list of subscribed users /user/getUsers
    //2. Call the /weather/subscribe route to send the weather details'

    // const subscribedUsers = await this.userService.getSubscribedUsers();
    // for (const user of subscribedUsers) {
    //   const weatherData = await this.weatherService.getWeather(user.city);
    //   // Implement logic to send weather data as a notification to user.chatId
    //   // You can use a messaging service like Telegram API to send messages to users.
    // }
  }
}
