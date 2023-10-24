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
import { Redirect } from '@nestjs/common';

@Controller('auth')
export class AuthController {
  constructor(private readonly configService: ConfigService) {}
  private authenticatedUsers: any[] = [];
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
  async handleLogin(
    @Body('credential') idToken: string,
    @Res() res: Response,
  ): Promise<{ redirectUrl: string } | null> {
    const client = new OAuth2Client();
    console.log('token', idToken);
    this.authenticatedUsers = [];

    try {
      const ticket = await client.verifyIdToken({
        idToken,
        audience: this.configService.get('GOOGLE_CLIENT_ID'), // Specify the CLIENT_ID of the app that accesses the backend
      });

      const user = ticket.payload;

      console.log('ticket', user);
      // Store the authenticated user in the backend state
      this.authenticatedUsers.push(user);

      if (user) {
        console.log('i am in if');
        // Generate a redirect URL for successful authentication
        const redirectUrl =
          'https://admin-panel-telegram-bot.onrender.com/auth-resolver'; // Adjust the route as per your frontend structure
        res.redirect(redirectUrl);
        return;
      }

      // return user;
    } catch (error) {
      console.error('ID token verification error:', error.message);
      return null; // Return null if authentication fails
    }
  }

  // New route to send authenticated users back to the frontend
  @Get('authenticated-user')
  getAuthenticatedUsers(): any[] {
    console.log('I am in authenticated-user');
    console.log(this.authenticatedUsers);
    return this.authenticatedUsers;
  }
}
