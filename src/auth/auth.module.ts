import { Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { ConfigModule, ConfigService } from '@nestjs/config';
// import { GoogleStrategy } from './google.strategy';
import { AuthController } from './auth.controller';

@Module({
  imports: [
    PassportModule.register({ defaultStrategy: 'google' }),
    ConfigModule,
  ],
  providers: [ConfigService],
  controllers: [AuthController],
})
export class AuthModule {}
