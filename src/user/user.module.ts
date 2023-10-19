import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { UserModel } from './user.model';
import { MongooseModule } from '@nestjs/mongoose';
import { UserSchema } from './user.model';
import { TelegramBotModule } from 'src/telegram-bot/telegram-bot.module';
@Module({
  imports: [
    MongooseModule.forFeature([{ name: 'User', schema: UserSchema }]),
    TelegramBotModule,
  ],
  providers: [UserService, UserModel],
  controllers: [UserController],
  exports: [UserService, UserModel],
})
export class UserModule {}
