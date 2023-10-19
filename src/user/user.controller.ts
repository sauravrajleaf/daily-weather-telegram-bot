import { Controller, Post, Body } from '@nestjs/common';
import { UserService } from './user.service';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  //this route is for saving the subscribed user to the database
  //handle new registration and also check if the user already exists
  @Post('save')
  async subscribe(@Body() { chatId, city }): Promise<object> {
    try {
      //call the service which interacts with the database to save the user
      const user = await this.userService.createUser({ chatId, city });
      return user;
    } catch (error) {
      throw new Error('Subscribing Failed');
    }
  }
}
