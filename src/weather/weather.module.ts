import { Module } from '@nestjs/common';
import { WeatherController } from './weather.controller';
import { TelegramBotService } from '../telegram-bot/telegram-bot.service'; // Adjust the path based on your project structure
import { TelegramBotModule } from '../telegram-bot/telegram-bot.module';
import { WeatherService } from './weather.service';

@Module({
  imports: [TelegramBotModule],
  controllers: [WeatherController],
  providers: [WeatherService], // Add the services here
  exports: [WeatherService], // If you
})
export class WeatherModule {}
