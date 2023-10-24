import {
  Controller,
  Get,
  UseGuards,
  Req,
  Post,
  Res,
  Body,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Response } from 'express';
const { OAuth2Client } = require('google-auth-library');
import { ConfigService } from '@nestjs/config';

@Controller('auth')
export class AuthController {
  constructor(private readonly configService: ConfigService) {}
  // @Get('google')
  // @UseGuards(AuthGuard('google'))
  // googleAuth() {
  //   console.log('I am in google route');
  //   // Initiates Google OAuth authentication
  // }
  // @Get('redirect')
  // @UseGuards(AuthGuard('google'))
  // googleAuthRedirect(@Req() req) {
  //   if (!req.user) {
  //     return 'No user from google';
  //   }
  //   return {
  //     message: 'User information from google',
  //     user: req.user,
  //   };
  // }
  @Post('login')
  async handleLogin(@Body('credential') idToken: string): Promise<string> {
    const client = new OAuth2Client();
    console.log('token', idToken);

    try {
      const ticket = await client.verifyIdToken({
        idToken,
        audience: this.configService.get('GOOGLE_CLIENT_ID'), // Specify the CLIENT_ID of the app that accesses the backend
      });

      const user = ticket.payload;

      console.log('ticket', ticket);

      return user;
    } catch (error) {
      console.error('ID token verification error:', error.message);
      throw new Error('Invalid ID token');
    }
  }
}
