import { Module } from '@nestjs/common';
import { WeatherController } from './weather.controller';
import { WeatherService } from './weather.service';
import { TelegramBotModule } from 'src/telegram-bot/telegram-bot.module';

@Module({
  imports: [TelegramBotModule],
  controllers: [WeatherController],
  providers: [WeatherService, WeatherController],
  exports: [WeatherService, WeatherController],
})
export class WeatherModule {}
