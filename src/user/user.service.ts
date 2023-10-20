import { Injectable, Inject } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import mongoose from 'mongoose';
import { User } from './user.model';
import { TelegramBotService } from 'src/telegram-bot/telegram-bot.service';
const axios = require('axios');

@Injectable()
export class UserService {
  private readonly weatherApiUrl = process.env.OPEN_WEATHER_API_URL;
  private readonly apiKey = process.env.OPEN_WEATHER_API_KEY;

  constructor(
    @InjectModel('User') private readonly userModel: Model<User>,
    @Inject(TelegramBotService)
    private readonly telegramService: TelegramBotService,
  ) {}

  // Function to convert temperature from Kelvin to Celsius
  kelvinToCelsius(kelvinTemperature: number): number {
    return kelvinTemperature - 273.15;
  }

  async createUser(userDto: any): Promise<any> {
    try {
      // console.log('userDto', userDto);
      const chatId = userDto.chatId;
      const city = userDto.city;
      const user = await this.userModel.findOne({ chatId }).exec();

      //check if user exists
      if (user) {
        const userId = user._id;
        const currCity = user.city;
        //check if user exists with the same city details
        if (user.city === userDto.city) {
          this.telegramService.sendMessageToUser(
            chatId,
            'User already subscribed with same city!',
          );
          // return user;
        } else {
          //if new city is passed update the city details
          const updatedUser = await this.userModel.findOneAndUpdate(
            { _id: new mongoose.Types.ObjectId(userId) },
            { $set: { city } },
            { new: true },
          );
          this.telegramService.sendMessageToUser(
            chatId,
            `User already subscribed! City Updated form ${currCity} ✈️ ${city}`,
          );
          // return updatedUser;
        }
      }
      const createdUser = new this.userModel(userDto);
      await createdUser.save();

      if (!user) {
        this.telegramService.sendMessageToUser(
          chatId,
          `User subscribed for daily weather report for ${city}!`,
        );
      }

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

      this.telegramService.sendMessageToUser(chatId, message);
    } catch (error) {
      throw new Error('Subscribing Failed');
    }
  }

  async getAllUserList(): Promise<any> {
    const allUsers = await this.userModel.find().exec();
    // console.log('allUsers', allUsers);
    return allUsers;
  }
}
