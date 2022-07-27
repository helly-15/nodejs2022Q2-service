import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  Param,
  ParseUUIDPipe,
  Post,
  Put,
  Req,
  Res, UseFilters,
  UseGuards,
  UsePipes,
  ValidationPipe
} from "@nestjs/common";
import { Request } from 'express';
import { UserService } from './user.service';
import { CreateUserDto, UpdateDto } from './dto/user.dto';
import { HttpExceptionFilter } from "../exceptions/http-exception.filter";
//import { JwtGuard } from '../auth/guard';
@UseFilters(new HttpExceptionFilter())
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
  getUserById(@Param('id', ParseUUIDPipe) id) {
    return this.userService.getUserById(id);
  }

  @Post('')
  postUser(@Body(new ValidationPipe({ whitelist: true })) dto: CreateUserDto) {
    return this.userService.postUser(dto);
  }

  @Delete(':id')
  @HttpCode(204)
  deleteUser(@Param('id', ParseUUIDPipe) id) {
    return this.userService.deleteUser(id);
  }

  @Put(':id')
  @UsePipes(
    new ValidationPipe({
      forbidNonWhitelisted: true,
      whitelist: true,
      transform: true,
    }),
  )
  update(@Param('id', ParseUUIDPipe) id, @Body() updateDto: UpdateDto) {
    return this.userService.updateUser(id, updateDto);
  }
}
