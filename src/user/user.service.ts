import { PrismaService } from '../prisma/prisma.service';
import { ForbiddenException, Injectable } from '@nestjs/common';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime';
import { CreateUserDto, UpdateDto } from './dto/user.dto';
import { v4 as uuid } from 'uuid';
import { HttpException } from '@nestjs/common/exceptions/http.exception';

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
      throw new HttpException('User not found', 404);
    }
  }
  async postUser(dto: CreateUserDto) {
    const id: string = uuid();
    try {
      const data = {
        id: id,
        login: dto.login,
        password: dto.password,
        version: 1,
        createdAt: Date.now(),
        updatedAt: Date.now(),
      };
      const result = await this.prisma.user.create({
        data,
      });

      return {
        id: result.id,
        login: result.login,
        version: result.version,
        createdAt: Date.now(),
        updatedAt: Date.now(),
        // TODO need all data of user except password
      };
    } catch (error) {
      throw new Error('Login and password should be strings');
    }
  }

  async deleteUser(id: string) {
    try {
      const user = await this.prisma.user.delete({
        where: { id: id },
      });
      return user;
    } catch (error) {
      throw new HttpException("User doesn't exist", 404);
    }
  }

  async updateUser(id: string, updateDto: UpdateDto) {
    try {
      const user = await this.prisma.user.findUniqueOrThrow({
        where: {
          id: id,
        },
      });
      if (user.password === updateDto.oldPassword) {
        await this.prisma.user.update({
          where: { id: id },
          data: {
            password: updateDto.newPassword,
            version: user.version + 1,
            updatedAt: Date.now(),
          },
        });
      } else return 'You are cheating mister, the password does not match!';
    } catch (error) {
      throw new ForbiddenException('User not found');
    }
  }
}
