import { Injectable, Logger } from '@nestjs/common';

const TelegramBot = require('node-telegram-bot-api');

require('dotenv').config();

const TELEGRAM_TOKEN = process.env.TELEGRAM_TOKEN;

@Injectable()
export class TelegramBotService {
  private readonly bot: any;
  // private readonly bot:TelegramBot // works after installing types
  private logger = new Logger(TelegramBotService.name);

  constructor() {
    this.bot = new TelegramBot(process.env.TELEGRAM_TOKEN, {
      polling: true,
    });
    console.log('TelegramBotService instance created.');
    this.bot.on('message', this.onReceiveMessage);

    this.sendMessageToUser(
      process.env.TEST_CHAT_ID,
      `Server started at ${new Date()}`,
    );
  }

  onReceiveMessage = (msg: any) => {
    this.logger.debug(msg);
  };

  sendMessageToUser = (userId: string, message: string) => {
    this.bot.sendMessage(userId, message);
  };
}
