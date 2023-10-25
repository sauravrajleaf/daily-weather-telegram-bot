import { Injectable, Inject } from '@nestjs/common';
import { TelegramBotService } from 'src/telegram-bot/telegram-bot.service';

const axios = require('axios');

@Injectable()
export class WeatherService {
  private readonly weatherApiUrl = process.env.OPEN_WEATHER_API_URL;
  private readonly apiKey = process.env.OPEN_WEATHER_API_KEY;

  constructor(
    @Inject(TelegramBotService)
    private readonly telegramService: TelegramBotService,
  ) {}
  // Function to convert temperature from Kelvin to Celsius
  kelvinToCelsius(kelvinTemperature: number): number {
    return kelvinTemperature - 273.15;
  }

  async getWeather(city: string, chatId: string): Promise<any> {
    try {
      const response = await axios.get(
        `${this.weatherApiUrl}?q=${city}&appid=${this.apiKey}`,
      );
      const weather = response.data;

      const cityMsg = weather.name;
      const description = weather.weather[0].description;
      const temperature = weather.main.temp;
      const feelsLike = weather.main.feels_like;
      const humidity = weather.main.humidity;
      const pressure = weather.main.pressure;
      const windSpeed = weather.wind.speed;
      const visibility = weather.visibility;
      const sunriseTimestamp = weather.sys.sunrise;
      const sunsetTimestamp = weather.sys.sunset;

      const sunriseTime = new Date(
        sunriseTimestamp * 1000,
      ).toLocaleTimeString();
      const sunsetTime = new Date(sunsetTimestamp * 1000).toLocaleTimeString();

      const message = `🌦️ **Weather Update for ${cityMsg}:**
      - 🌧️<b>Condition</b>: ${description}
      - 🌡️<b>Temperature</b>: ${this.kelvinToCelsius(temperature).toFixed(2)}°C
      -  🌬️<b>Feels Like</b>: ${this.kelvinToCelsius(feelsLike).toFixed(2)}°C
      -  💧<b>Humidity</b>: ${humidity}%
      -  🏔️<b>Pressure</b>: ${pressure} hPa
      -  🌪️<b>Wind Speed</b>: ${windSpeed} m/s
      -  👀<b>Visibility</b>: ${visibility} meters
      -  🌅<b>Sunrise</b>: ${sunriseTime}
      -  🌇<b>Sunset</b>: ${sunsetTime}`;

      this.telegramService.sendMessageToUser(chatId, message);

      return weather;
    } catch (error) {
      throw new Error(
        `Failed to fetch weather data for ${city}. Please try again later.Errored in service`,
      );
    }
  }
}
