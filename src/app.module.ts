import { Module, Global } from '@nestjs/common';
import { AppService } from './app.service';
import { TelegramBotModule } from './telegram-bot/telegram-bot.module';
import { WeatherService } from './weather/weather.service';
import { WeatherModule } from './weather/weather.module';
import { WeatherController } from './weather/weather.controller';
import { DatabaseModule } from './database/database.module';
import { UserModule } from './user/user.module';
import { SchedulerService } from './scheduler/scheduler.service';
import { ScheduleModule } from '@nestjs/schedule';
import { AppController } from './app.controller';
import { ConfigModule } from '@nestjs/config';
import { AuthModule } from './auth/auth.module';
// import { GoogleStrategy } from './auth/google.strategy';

@Global()
@Module({
  imports: [
    ScheduleModule.forRoot(),
    TelegramBotModule,
    WeatherModule,
    DatabaseModule,
    UserModule,
    ConfigModule.forRoot(),
    AuthModule,
  ],
  controllers: [WeatherController, AppController],
  providers: [AppService, WeatherService, SchedulerService],
})
export class AppModule {}
