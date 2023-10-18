import { Controller, Post, Body } from '@nestjs/common';
import { TelegramBotService } from '../telegram-bot/telegram-bot.service';
import { WeatherService } from '../weather/weather.service';

@Controller('weather')
export class WeatherController {
  constructor(
    private readonly telegramService: TelegramBotService,
    private readonly weatherService: WeatherService,
  ) {}

  //this shows route
  @Post('subscribe')
  async subscribe(@Body() { chatId, city }): Promise<void> {
    // Save subscription to the database (not shown in this example).
    const weather = await this.weatherService.getWeather(city);
    const message = `Daily weather update for ${city}: ${weather}`;
    await this.telegramService.sendMessageToUser(chatId, message);
  }
}
