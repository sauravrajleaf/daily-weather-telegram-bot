import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TelegramBotModule } from './telegram-bot/telegram-bot.module';
import { WeatherService } from './weather/weather.service';
import { WeatherModule } from './weather/weather.module';
import { WeatherController } from './weather/weather.controller';

@Module({
  imports: [TelegramBotModule, WeatherModule],
  controllers: [WeatherController],
  providers: [AppService, WeatherService],
})
export class AppModule {}
