import { Module } from '@nestjs/common';
import { TelegramBotModule } from 'src/telegram-bot/telegram-bot.module';
import { UserModule } from 'src/user/user.module';
import { WeatherModule } from 'src/weather/weather.module';
@Module({
  imports: [WeatherModule, UserModule, TelegramBotModule],
})
export class SchedulerModule {}
