import { Module } from '@nestjs/common';
import { TelegramBotService } from './telegram-bot.service';
import { KeepAliveTaskService } from 'src/keep-alive-service/keep-alive-service.service';

@Module({
  providers: [TelegramBotService, KeepAliveTaskService],
  exports: [TelegramBotService],
})
export class TelegramBotModule {}
