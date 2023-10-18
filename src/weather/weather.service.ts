import { Injectable } from '@nestjs/common';

const axios = require('axios');

@Injectable()
export class WeatherService {
  private readonly weatherApiUrl = process.env.OPEN_WEATHER_API_URL;
  private readonly apiKey = process.env.OPEN_WEATHER_API_KEY;

  async getWeather(city: string): Promise<string> {
    try {
      const response = await axios.get(
        `${this.weatherApiUrl}?q=${city}&appid=${this.apiKey}`,
      );
      return response.data;
    } catch (error) {
      throw new Error(
        `Failed to fetch weather data for ${city}. Please try again later.`,
      );
    }
  }
}
