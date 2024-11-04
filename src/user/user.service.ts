import { Injectable } from '@nestjs/common';
import { UserDto } from './user.dto';

@Injectable()
export class UserService {
  constructor() {}

  subscribe(subscribeDto: UserDto) {
    return `Subscribed to ${subscribeDto.city} weather updates for ${subscribeDto.email}`;
  }

  unsubscribe(email: string) {
    return `Unsubscribed from weather updates for ${email}`;
  }
}
