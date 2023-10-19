import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { UserModel } from './user.model';
import { MongooseModule } from '@nestjs/mongoose';
import { UserSchema } from './user.model';

@Module({
  imports: [MongooseModule.forFeature([{ name: 'User', schema: UserSchema }])],
  providers: [UserService, UserModel],
  controllers: [UserController],
  exports: [UserService, UserModel],
})
export class UserModule {}
