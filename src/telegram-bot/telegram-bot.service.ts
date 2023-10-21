import { Injectable, Logger } from '@nestjs/common';

import * as TelegramBot from 'node-telegram-bot-api';

require('dotenv').config();
import axios from 'axios';
const TELEGRAM_TOKEN = process.env.TELEGRAM_TOKEN;
const WEATHER_API_URL = `${process.env.URL}/weather/subscribe`;
const SAVE_USER_URL = `${process.env.URL}/user/save`;
@Injectable()
export class TelegramBotService {
  private readonly bot: TelegramBot;
  // private readonly bot:TelegramBot // works after installing types
  private logger = new Logger(TelegramBotService.name);

  constructor() {
    this.bot = new TelegramBot(TELEGRAM_TOKEN, {
      polling: true,
    });
    this.bot.sendMessage('1013100688', 'TelegramBotService instance created.');

    this.setupEventHandlers();
  }

  private setupEventHandlers(): void {
    this.bot.onText(/\/start/, (msg) => this.onStart(msg));
    this.bot.onText(/\/subscribe (.+)/, (msg, match) =>
      this.onSubscribe(msg, match),
    );
    // Add more event handlers as needed
  }

  onStart(msg: TelegramBot.Message) {
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

  async onSubscribe(msg: TelegramBot.Message, match: any) {
    const chatId = msg.chat.id;
    const city = match[1];

    try {
      await axios.post(SAVE_USER_URL, { chatId, city });
      await axios.post(WEATHER_API_URL, { chatId, city });
    } catch (error) {
      this.bot.sendMessage(
        chatId,
        `Failed to fetch weather data for ${city}. Please try again later.`,
      );
    }
  }
}
