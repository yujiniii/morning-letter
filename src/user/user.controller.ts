import { Body, Controller, Get, Post, Query } from '@nestjs/common';
import { UserDto } from './user.dto';
import { UserService } from './user.service';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post('subscribe')
  async subscribe(@Body() subscribeDto: UserDto) {
    return this.userService.subscribe(subscribeDto);
  }

  @Get('unsubscribe')
  async unsubscribe(@Query('email') email: string) {
    return this.userService.unsubscribe(email);
  }
}
