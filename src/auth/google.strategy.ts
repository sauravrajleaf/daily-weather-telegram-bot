// // auth/google.strategy.ts

// import { Injectable } from '@nestjs/common';
// import { PassportStrategy } from '@nestjs/passport';
// import { Strategy, VerifyCallback } from 'passport-google-oauth20';
// import { ConfigService } from '@nestjs/config';

// require('dotenv').config();

// @Injectable()
// export class GoogleStrategy extends PassportStrategy(Strategy, 'google') {
//   constructor(private readonly configService: ConfigService) {
//     console.log('process.env.GOOGLE_CLIENT_ID', process.env.GOOGLE_CLIENT_ID);

//     super({
//       clientID: configService.get('GOOGLE_CLIENT_ID'),
//       clientSecret: configService.get('GOOGLE_CLIENT_SECRET'),
//       callbackURL: configService.get('GOOGLE_CALLBACK_URL'),
//       passReqToCallback: true,
//       scope: ['email', 'profile'],
//     });
//   }

//   async validate(
//     request: any,
//     accessToken: string,
//     refreshToken: string,
//     profile: any,
//     done: VerifyCallback,
//   ): Promise<any> {
//     console.log('I am in validation');
//     // Implement your validation logic here
//     // You can access user information from the `profile` object
//     const user = {
//       googleId: profile.id,
//       email: profile.emails[0].value,
//       name: profile.displayName,
//       // ... other user properties you want to store
//     };
//     console.log('user object', user);
//     done(null, user);
//   }
// }
