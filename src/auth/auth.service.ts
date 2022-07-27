import { ForbiddenException, Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { AuthDto } from './dto';
import * as argon from 'argon2';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { v4 as uuid } from 'uuid';

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwt: JwtService,
    private config: ConfigService,
  ) {}

  async signup(dto: AuthDto) {
    const hash = await argon.hash(dto.password);
    const id: string = uuid();
    try {
      const user = await this.prisma.user.create({
        data: {
          id: id,
          login: dto.login,
          password: hash,
          createdAt: Date.now(),
          updatedAt: Date.now(),
        },
      });
      return this.signToken(user.login, user.password);
    } catch (error) {
      if (error instanceof PrismaClientKnownRequestError) {
        if (error.code === 'P2002') {
          throw new ForbiddenException('Credentials taken and not unique');
        }
      }
      throw error;
    }
  }

  async signin(dto: AuthDto) {
    // find the user by login
    const user = await this.prisma.user.findUnique({
      where: {
        login: dto.login,
      },
    });
    // if user does not exist throw exception
    if (!user) throw new ForbiddenException('Credentials incorrect');

    // compare password
    //toDo: тут случайно не надо поставить hash вместо dtp.password?
    const pwMatches = await argon.verify(user.password, dto.password);
    // if password incorrect throw exception
    if (!pwMatches) throw new ForbiddenException('Credentials incorrect');

    return this.signToken(user.id, user.login);
  }
  async signToken(
    userId: string,
    login: string,
  ): Promise<{ access_token: string }> {
    const payload = {
      sub: userId,
      login,
    };
    const secret = this.config.get('JWT_SECRET_KEY');

    const token = await this.jwt.signAsync(payload, {
      expiresIn: '11111111m',
      secret: secret,
    });

    return {
      access_token: token,
    };
  }
}
