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
    this.bot.onText(/\/unsubscribe/, (msg) => this.onUnsubscribe(msg));
    // Add more event handlers as needed
  }

  onStart(msg: TelegramBot.Message) {
    const chatId = msg.chat.id;
    const welcomeMessage = `🌦️ <b>Welcome to WeatherBot!</b> 🌈

    Excited to have you on board! Here's a quick guide to our WeatherBot:
    
    <b>About WeatherBot:</b>
    Your friendly neighborhood weather companion! 🌍 Get daily weather notifications at 6 am sharp! Whether you're planning a day out or curious about local weather, WeatherBot's got you covered.
    
    <b>How to Start:</b>
    - <b>Subscribe</b>: Type /subscribe cityname to receive daily updates. E.g., /subscribe Bangalore. 🏙️
    - <b>Update City:</b> Change your subscribed city anytime with /subscribe newcityname.
    - <b>Live Updates:</b> For real-time weather, type /subscribe cityname. 🌦️
    - <b>To Unsubscribe:</b> For unsubscribing, type /unsubscribe. 😢
    - <b>Pin for Future:</b> Pin this message for quick reference! 📌
    
    Enjoy your weather journey! If you have questions, contact admin.
    
    🚀 <b>Coming Soon:</b>
    1. <b>Menu Options: </b> 🚫
    Manage commands effortlessly. Stay tuned for updates! For now, contact our friendly admin to unsubscribe. Thanks for your patience! 🌟
    
    <b>Happy weather watching!</b> ☔️🌞`;
    this.bot.sendMessage(chatId, welcomeMessage, { parse_mode: 'HTML' });
  }

  // Function to convert temperature from Kelvin to Celsius
  kelvinToCelsius(kelvinTemperature: number): number {
    return kelvinTemperature - 273.15;
  }

  sendMessageToUser = (userId: string, message: string) => {
    // console.log(userId, message);
    this.bot.sendMessage(userId, message, { parse_mode: 'HTML' });
  };

  async onSubscribe(msg: TelegramBot.Message, match: any) {
    // const chatId = msg.chat.id;
    const { id, first_name, last_name, username } = msg.chat;
    const city = match[1];
    // console.log('match', msg);
    // console.log(
    //   'chatId, first_name, last_name, username',
    //   id,
    //   first_name,
    //   last_name,
    //   username,
    // );
    try {
      await axios.post(SAVE_USER_URL, {
        chatId: id,
        city,
        firstName: first_name,
        lastName: last_name,
        UserName: username,
      });
      const weather = await axios.post(WEATHER_API_URL, { chatId: id, city });
      return;
    } catch (error) {
      this.bot.sendMessage(
        id,
        `Failed to fetch weather data for ${city}. Please try again later.`,
      );
    }
  }

  async onUnsubscribe(msg: TelegramBot.Message) {
    console.log('I am here in onUnsubscribe telegram service');
    const chatId = msg.chat.id;

    try {
      await axios.post(UNSUBSCRIBE_USER_URL, { chatId });
    } catch (error) {}
  }
}
