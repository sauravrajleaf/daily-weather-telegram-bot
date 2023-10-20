import { Injectable, Logger } from '@nestjs/common';

const TelegramBot = require('node-telegram-bot-api');

require('dotenv').config();
const axios = require('axios');

const TELEGRAM_TOKEN = process.env.TELEGRAM_TOKEN;
const WEATHER_API_URL = `${process.env.URL}/weather/subscribe`;
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
    this.bot.sendMessage(userId, message, { parse_mode: 'HTML' });
  };

  async onSubscribe(msg: any, match: any) {
    const chatId = msg.chat.id;
    const city = match[1];

    try {
      await Promise.all([
        axios.post(SAVE_USER_URL, { chatId, city }),
        axios.post(WEATHER_API_URL, { chatId, city }),
      ]);
    } catch (error) {
      this.bot.sendMessage(
        chatId,
        `Failed to fetch weather data for ${city}. Please try again later.`,
      );
    }
  }
}
