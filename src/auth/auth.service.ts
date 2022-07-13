import { Injectable } from '@nestjs/common';

@Injectable({})
export class AuthService {
  signin() {
    return { msg: 'Sighnedin' };
  }
  signup() {
    return { msg: 'Sighnedup' };
  }
}
