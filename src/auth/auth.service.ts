import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class AuthService {
  constructor(private prisma: PrismaService) {}

  signin() {
    return { msg: 'Sighnedin' };
  }
  signup() {
    return { msg: 'Sighnedup' };
  }
}
