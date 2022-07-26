import { PrismaService } from '../prisma/prisma.service';
import { ForbiddenException, Injectable } from '@nestjs/common';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime';
import { CreateUserDto, UpdateDto } from './dto/user.dto';
import { v4 as uuid } from 'uuid';
import { HttpException } from '@nestjs/common/exceptions/http.exception';
import { CustomException } from '../exceptions/myException';

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
      throw new CustomException('User not found', 404);
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
      throw new CustomException("User doesn't exist", 404);
    }
  }

  async updateUser(id: string, updateDto: UpdateDto) {
    let user;
    try {
      user = await this.prisma.user.findUniqueOrThrow({
        where: {
          id: id,
        },
      });
    } catch (error) {
      throw new CustomException("User doesn't exist", 404);
    }

    if (user.password !== updateDto.oldPassword) {
      throw new CustomException('The password does not match!', 403);
    }
    const newUser = await this.prisma.user.update({
      where: { id: id },
      data: {
        password: updateDto.newPassword,
        version: user.version + 1,
        updatedAt: Date.now(),
      },
    });
    return {
      id: id,
      login: newUser.login,
      version: newUser.version,
      createdAt: newUser.createdAt,
      updatedAt: newUser.updatedAt,
    };
  }
}
