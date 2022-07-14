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
  //PasrseIntPipe validates that password is a number
  @Post('signin')
  signin(
    @Body('email') email: string,
    @Body('password', ParseIntPipe) password: string,
  ) {
    console.log({ email, password });
    return this.authService.signin();
  }
}
