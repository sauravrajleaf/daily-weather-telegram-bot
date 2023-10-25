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
    const welcomeMessage = `🌤️ Welcome to WeatherBot!

    Excited to have you on board! Here's everything you need to know about our WeatherBot:
    
    About the Bot:
    WeatherBot is your friendly neighborhood weather companion! 🌍 Get ready to receive daily weather notifications delivered right to your doorstep every day at 6 am sharp! Whether you're planning a day out or just curious about the weather in your area, WeatherBot has got you covered.
    
    How to Get Started:
    
    Subscribe: To start receiving your daily weather updates, simply type /subscribe <cityname>. For example, /subscribe Bangalore. 🏙️
    Update City: Have a change of plans? No worries! Update your subscribed city anytime by typing /subscribe <newcityname>.
    Live Updates: Need real-time weather info? Just type /weather <cityname> to get the latest updates instantly. 🌦️
    Pin for Future: Don't forget to pin this message in the chat for quick reference! 📌
    WeatherBot is here to make your day brighter (or rainier, depending on the forecast)! Feel free to explore and enjoy your weather journey with us. If you have any questions, simply type /help.
    
    Happy weather watching! ☔️🌞`;
    this.bot.sendMessage(chatId, welcomeMessage, { parse_mode: 'HTML' });
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

      // const weatherData = weather.data;

      // const cityMsg = weatherData.name;
      // const description = weatherData.weather[0].description;
      // const temperature = weatherData.main.temp;
      // const feelsLike = weatherData.main.feels_like;
      // const humidity = weatherData.main.humidity;
      // const pressure = weatherData.main.pressure;
      // const windSpeed = weatherData.wind.speed;
      // const visibility = weatherData.visibility;
      // const sunriseTimestamp = weatherData.sys.sunrise;
      // const sunsetTimestamp = weatherData.sys.sunset;

      // const sunriseTime = new Date(
      //   sunriseTimestamp * 1000,
      // ).toLocaleTimeString();
      // const sunsetTime = new Date(sunsetTimestamp * 1000).toLocaleTimeString();

      // const message = `
      // 🌦️ Weather Update for ${cityMsg}:
      // - <b>Condition</b>: ${description}
      // - <b>Temperature</b>: ${this.kelvinToCelsius(temperature).toFixed(2)}°C
      // - <b>Feels Like</b>: ${this.kelvinToCelsius(feelsLike).toFixed(2)}°C
      // - <b>Humidity</b>: ${humidity}%
      // - <b>Pressure</b>: ${pressure} hPa
      // - <b>Wind Speed</b>: ${windSpeed} m/s
      // - <b>Visibility</b>: ${visibility} meters
      // - <b>Sunrise</b>: ${sunriseTime}
      // - <b>Sunset</b>: ${sunsetTime}
      // `;

      // this.bot.sendMessageToUser(chatId, message);
      // console.log(weather.data);
      return;
    } catch (error) {
      this.bot.sendMessage(
        chatId,
        `Failed to fetch weather data for ${city}. Please try again later.`,
      );
    }
  }
}
