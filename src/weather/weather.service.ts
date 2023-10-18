import { Injectable } from '@nestjs/common';

const axios = require('axios');

@Injectable()
export class WeatherService {
  private readonly weatherApiUrl =
    'https://api.openweathermap.org/data/2.5/weather';
  private readonly apiKey = '63f571c9180466fdc49d78045932fff9';

  async getWeather(city: string): Promise<string> {
    const response = await axios.get(
      `${this.weatherApiUrl}?q=${city}&appid=${this.apiKey}`,
    );
    // Parse the weather data and return a formatted message.
    return response.data.weather[0].description;
  }
}
