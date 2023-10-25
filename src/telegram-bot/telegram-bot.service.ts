import { Injectable, Logger } from '@nestjs/common';

import * as TelegramBot from 'node-telegram-bot-api';

require('dotenv').config();
import axios from 'axios';
const TELEGRAM_TOKEN = process.env.TELEGRAM_TOKEN;
const WEATHER_API_URL = `${process.env.URL}/weather/subscribe`;
const SAVE_USER_URL = `${process.env.URL}/user/save`;
const UNSUBSCRIBE_USER_URL = `${process.env.URL}/user/unsubscribe`;
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
    this.bot.onText(/\/unsubscribe (.+)/, (msg) => this.onUnsubscribe(msg));
    // Add more event handlers as needed
  }

  onStart(msg: TelegramBot.Message) {
    const chatId = msg.chat.id;
    const welcomeMessage = `🌦️ Welcome to WeatherBot! 🌈

    Excited to have you on board! Here's a quick guide to our WeatherBot:
    
    About WeatherBot:
    Your friendly neighborhood weather companion! 🌍 Get daily weather notifications at 6 am sharp! Whether you're planning a day out or curious about local weather, WeatherBot's got you covered.
    
    How to Start:
    - Subscribe: Type /subscribe <cityname> to receive daily updates. E.g., /subscribe Bangalore. 🏙️
    - Update City: Change your subscribed city anytime with /subscribe <newcityname>.
    - Live Updates: For real-time weather, type /subscribe <cityname>. 🌦️
    - Pin for Future: Pin this message for quick reference! 📌
    
    Enjoy your weather journey! If you have questions, type /help.
    
    🚀 Coming Soon:
    1. Unsubscribe Feature: 🚫
    Manage subscriptions effortlessly. Stay tuned for updates! For now, contact our friendly admin to unsubscribe. Thanks for your patience! 🌟
    
    Happy weather watching! ☔️🌞`;
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
      const weather = await axios.post(WEATHER_API_URL, { chatId, city });
      return;
    } catch (error) {
      this.bot.sendMessage(
        chatId,
        `Failed to fetch weather data for ${city}. Please try again later.`,
      );
    }
  }

  async onUnsubscribe(msg: TelegramBot.Message) {
    const chatId = msg.chat.id;

    try {
      await axios.post(UNSUBSCRIBE_USER_URL, { chatId });
    } catch (error) {}
  }
}
