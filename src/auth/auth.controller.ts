import {
  Body,
  Controller,
  ParseIntPipe,
  Post,
  UseFilters,
  ValidationPipe,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthDto } from './dto';
import { HttpExceptionFilter } from '../exceptions/http-exception.filter';
@UseFilters(new HttpExceptionFilter())
@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}
  //ValidationPipe validates dto
  @Post('signup')
  signup(@Body(new ValidationPipe({ whitelist: true })) dto: AuthDto) {
    return this.authService.signup(dto);
  }

  @Post('login')
  signin(@Body(new ValidationPipe({ whitelist: true })) dto: AuthDto) {
    return this.authService.signin(dto);
  }
}
