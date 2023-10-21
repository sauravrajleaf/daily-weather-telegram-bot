import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';
import { TelegramBotService } from './telegram-bot/telegram-bot.service';

@Controller()
export class AppController {
  constructor(
    private readonly appService: AppService,
    private readonly telegraBotService: TelegramBotService,
  ) {}

  @Get() // This handles the root URL ("/")
  root(): string {
    return 'Welcome to the scheduler service!';
  }
}
