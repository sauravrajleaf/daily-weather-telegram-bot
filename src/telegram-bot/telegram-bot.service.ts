import { Injectable, Logger } from '@nestjs/common';

const TelegramBot = require('node-telegram-bot-api');

require('dotenv').config();
const axios = require('axios');

const TELEGRAM_TOKEN = process.env.TELEGRAM_TOKEN;
const WEATHER_API_URL = `${process.env.URL}/weather/subscribe`; // Replace with your API endpoint
const SAVE_USER_URL = `${process.env.URL}/user/save`;
@Injectable()
export class TelegramBotService {
  private static instance: TelegramBotService;
  private readonly bot: any;
  // private readonly bot:TelegramBot // works after installing types
  private logger = new Logger(TelegramBotService.name);

  constructor() {
    this.bot = new TelegramBot(TELEGRAM_TOKEN, {
      polling: true,
    });
    this.logger.log('TelegramBotService instance created.');
    this.setupEventHandlers();
  }

  static getInstance(): TelegramBotService {
    if (!TelegramBotService.instance) {
      TelegramBotService.instance = new TelegramBotService();
    }
    return TelegramBotService.instance;
  }

  private setupEventHandlers(): void {
    this.bot.onText(/\/start/, (msg) => this.onStart(msg));
    this.bot.onText(/\/subscribe (.+)/, (msg, match) =>
      this.onSubscribe(msg, match),
    );
    // Add more event handlers as needed
  }

  onStart(msg: any) {
    const chatId = msg.chat.id;
    const welcomeMessage = `Welcome to the WeatherBot! Type /subscribe <city> to get weather updates for a specific city.`;
    this.bot.sendMessage(chatId, welcomeMessage);
  }

  // Function to convert temperature from Kelvin to Celsius
  kelvinToCelsius(kelvinTemperature: number): number {
    return kelvinTemperature - 273.15;
  }

  sendMessageToUser = (userId: string, message: string) => {
    this.bot.sendMessage(userId, message);
  };

  async onSubscribe(msg: any, match: any) {
    // console.log('i am here');
    const chatId = msg.chat.id;
    const city = match[1];

    try {
      const saveUserResp = await axios.post(SAVE_USER_URL, { chatId, city });
      // console.log('saveUserREsp', saveUserResp);
      const response = await axios.post(WEATHER_API_URL, { chatId, city });
      const weatherData = response.data;
      // console.log(weatherData);
      const cityMsg = weatherData.name;
      const description = weatherData.weather[0].description;
      const temperature = weatherData.main.temp;
      const feelsLike = weatherData.main.feels_like;
      const humidity = weatherData.main.humidity;
      const pressure = weatherData.main.pressure;
      const windSpeed = weatherData.wind.speed;
      const visibility = weatherData.visibility;
      const sunriseTimestamp = weatherData.sys.sunrise;
      const sunsetTimestamp = weatherData.sys.sunset;

      const sunriseTime = new Date(
        sunriseTimestamp * 1000,
      ).toLocaleTimeString();
      const sunsetTime = new Date(sunsetTimestamp * 1000).toLocaleTimeString();

      // console.log(weather);
      const message = `
      🌦️ Weather Update for ${cityMsg}:
      - <b>Condition</b>: ${description}
      - <b>Temperature</b>: ${this.kelvinToCelsius(temperature).toFixed(2)}°C
      - <b>Feels Like</b>: ${this.kelvinToCelsius(feelsLike).toFixed(2)}°C
      - <b>Humidity</b>: ${humidity}%
      - <b>Pressure</b>: ${pressure} hPa
      - <b>Wind Speed</b>: ${windSpeed} m/s
      - <b>Visibility</b>: ${visibility} meters
      - <b>Sunrise</b>: ${sunriseTime}
      - <b>Sunset</b>: ${sunsetTime}
      `;
      this.bot.sendMessage(chatId, message, { parse_mode: 'HTML' });
    } catch (error) {
      this.bot.sendMessage(
        chatId,
        `Failed to fetch weather data for ${city}. Please try again later.`,
      );
    }
  }
}
