import {
  Body,
  Controller,
  Get,
  Post,
  Req,
  UseGuards,
  ValidationPipe,
} from '@nestjs/common';
import { Request } from 'express';
import { UserService } from './user.service';
//import { JwtGuard } from '../auth/guard';

@Controller('user')
export class UserController {
  constructor(private userService: UserService) {}
  //@UseGuards(JwtGuard)
  @Get('me')
  getMe(@Req() req: Request) {
    return req.user;
  }
  @Get('')
  getAllUsers(@Req() req: Request) {
    return this.userService.getAllUsers();
  }

  // @Post('')
  // postUser(@Body(new ValidationPipe({ whitelist: true })) dto: AuthDto) {
  //   return this.userService.postUser(dto);
  // }
}
