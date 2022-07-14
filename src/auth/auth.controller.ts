import {
  Body,
  Controller,
  ParseIntPipe,
  Post,
  ValidationPipe,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthDto } from './dto';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}
  //ValidationPipe validates dto
  @Post('signup')
  signup(@Body(new ValidationPipe({ whitelist: true })) dto: AuthDto) {
    return this.authService.signup(dto);
  }

  @Post('signin')
  signin(@Body(new ValidationPipe({ whitelist: true })) dto: AuthDto) {
    return this.authService.signin(dto);
  }
}
