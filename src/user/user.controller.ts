import { Controller, Post, Body, Get } from '@nestjs/common';
import { UserService } from './user.service';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  //this route is for saving the subscribed user to the database
  //handle new registration and also check if the user already exists
  @Post('save')
  async subscribe(
    @Body()
    { chatId, city, isBlocked = false, firstName, lastName, UserName },
  ): Promise<object> {
    try {
      // console.log(chatId, city);
      //call the service which interacts with the database to save the user
      const user = await this.userService.createUser({
        chatId,
        city,
        isBlocked,
        firstName,
        lastName,
        UserName,
      });
      return user;
    } catch (error) {
      throw new Error('Subscribing Failed');
    }
  }

  @Post('block')
  async blockOrUpdateUser(@Body() { chatId, city }): Promise<object> {
    try {
      // console.log(chatId, city);
      //call the service which interacts with the database to save the user
      const user = await this.userService.blockOrUpdateUser({ chatId, city });
      return user;
    } catch (error) {
      throw new Error('Subscribing Failed');
    }
  }

  @Post('unsubscribe')
  async unsubscribeUser(@Body() { chatId }): Promise<object> {
    try {
      console.log('I am here in onUnsubscribe user controller');
      // console.log(chatId, city);
      //call the service which interacts with the database to save the user
      const user = await this.userService.unsubscribeUser({ chatId });
      return user;
    } catch (error) {
      throw new Error('Subscribing Failed');
    }
  }

  @Get('getUser')
  async getAllUsers(): Promise<any> {
    const users = await this.userService.getAllUserList();
    console.log('getallusers', users);
    return users;
    // console.log(this)
  }
}
