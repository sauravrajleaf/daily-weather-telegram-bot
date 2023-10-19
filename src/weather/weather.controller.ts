import { Controller, Post, Body } from '@nestjs/common';
import { WeatherService } from '../weather/weather.service';

@Controller('weather')
export class WeatherController {
  constructor(private readonly weatherService: WeatherService) {}

  //this route is for sending the weather result to the user
  @Post('subscribe')
  async subscribe(@Body() { chatId, city }): Promise<string> {
    try {
      const weather = await this.weatherService.getWeather(city);

      return weather;
    } catch (error) {
      throw new Error(
        `Failed to fetch weather data for ${city}. Please try again later.`,
      );
    }
  }
}
