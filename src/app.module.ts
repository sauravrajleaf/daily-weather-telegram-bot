import { Module } from '@nestjs/common';
import { AppService } from './app.service';
import { TelegramBotModule } from './telegram-bot/telegram-bot.module';
import { WeatherService } from './weather/weather.service';
import { WeatherModule } from './weather/weather.module';
import { WeatherController } from './weather/weather.controller';
import { DatabaseModule } from './database/database.module';
import { UserModule } from './user/user.module';

@Module({
  imports: [TelegramBotModule, WeatherModule, DatabaseModule, UserModule],
  controllers: [WeatherController],
  providers: [AppService, WeatherService],
})
export class AppModule {}