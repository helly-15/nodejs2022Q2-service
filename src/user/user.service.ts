import { PrismaService } from '../prisma/prisma.service';
import { ForbiddenException, Injectable } from '@nestjs/common';
import * as argon from 'argon2';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime';
import { UserDto } from './dto/user.dto';
import { v4 as uuid } from 'uuid';

@Injectable()
export class UserService {
  constructor(private prisma: PrismaService) {}

  async getAllUsers() {
    try {
      return await this.prisma.user.findMany();
    } catch (error) {
      if (error instanceof PrismaClientKnownRequestError) {
        if (error.code === 'P2001') {
          throw new ForbiddenException('User not found');
        }
      }
      throw error;
    }
  }

  async getUserById(id: string) {
    try {
      const user = await this.prisma.user.findUniqueOrThrow({
        where: {
          id: id,
        },
      });
      return user;
    } catch (error) {
      throw new ForbiddenException('User not found');
    }
  }
  async postUser(dto: UserDto) {
    const id: string = uuid();
    try {
      const data = {
        id: id,
        login: dto.login,
        password: dto.password,
      };
      const user = await this.prisma.user.create({
        data,
      });
      return user;
    } catch (error) {
      throw new Error('Login and password should be strings');
    }
  }

  async deleteUser(id: string) {
    const user = await this.prisma.user.delete({
      where: { id: id },
    });
    return user;
  }
}
