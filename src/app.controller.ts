import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get() // This handles the root URL ("/")
  root(): string {
    return 'Welcome to the scheduler service!';
  }
}
