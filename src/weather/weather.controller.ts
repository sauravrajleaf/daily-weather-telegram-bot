import { Controller, Post, Body } from '@nestjs/common';
import { WeatherService } from '../weather/weather.service';
import { TelegramBotService } from 'src/telegram-bot/telegram-bot.service';

@Controller('weather')
export class WeatherController {
  constructor(
    private readonly weatherService: WeatherService,
    private readonly telegramBotService: TelegramBotService,
  ) {}

  // Function to convert temperature from Kelvin to Celsius
  kelvinToCelsius(kelvinTemperature: number): number {
    return kelvinTemperature - 273.15;
  }

  //this route is for sending the weather result to the user
  @Post('subscribe')
  async subscribe(@Body() { chatId, city }): Promise<any> {
    try {
      // console.log('i am here');
      const weather = await this.weatherService.getWeather(city, chatId);

      return weather;
    } catch (error) {
      throw new Error(
        `Failed to fetch weather data for ${city}. Please try again later.Errored in controller`,
      );
    }
  }
}
