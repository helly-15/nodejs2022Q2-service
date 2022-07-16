import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Req,
  UseGuards,
  ValidationPipe,
} from '@nestjs/common';
import { Request } from 'express';
import { UserService } from './user.service';
import { UserDto } from './dto/user.dto';
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

  @Get(':id')
  getUserById(@Param('id') id) {
    return this.userService.getUserById(id);
  }

  @Post('')
  postUser(@Body(new ValidationPipe({ whitelist: true })) dto: UserDto) {
    return this.userService.postUser(dto);
  }

  @Delete(':id')
  deleteUser(@Param('id') id) {
    return this.userService.deleteUser(id);
  }
}
