import { PrismaService } from '../prisma/prisma.service';
import { ForbiddenException, Injectable } from '@nestjs/common';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime';
import { AlbumDto } from './dto/album.dto';
import { v4 as uuid } from 'uuid';
import { HttpException } from '@nestjs/common/exceptions/http.exception';

@Injectable()
export class AlbumService {
  constructor(private prisma: PrismaService) {}

  async getAllAlbums() {
    try {
      return await this.prisma.album.findMany();
    } catch (error) {
      if (error instanceof PrismaClientKnownRequestError) {
        if (error.code === 'P2001') {
          throw new ForbiddenException('Album not found');
        }
      }
      throw error;
    }
  }

  async getAlbumById(id: string) {
    try {
      const album = await this.prisma.album.findUniqueOrThrow({
        where: {
          id: id,
        },
      });
      return album;
    } catch (error) {
      throw new HttpException('Album not found', 404);
    }
  }

  async postAlbum(dto: AlbumDto) {
    const id: string = uuid();
    const data = {
      id: id,
      ...dto,
    };
    return await this.prisma.album.create({
      data,
    });
  }

  async deleteAlbum(id: string) {
    try {
      return await this.prisma.album.delete({
        where: { id: id },
      });
    } catch (error) {
      throw new HttpException("User doesn't exist", 404);
    }
  }

  async updateAlbum(id: string, updateDto: AlbumDto) {
    if (
      typeof updateDto.name !== 'string' ||
      typeof updateDto.year !== 'number'
    ) {
      throw new HttpException('Incorrect dto', 400);
    }
    try {
      await this.prisma.album.findUniqueOrThrow({
        where: {
          id: id,
        },
      });
    } catch (error) {
      throw new HttpException("Album doesn't exist", 404);
    }
    try {
      return await this.prisma.album.update({
        where: { id: id },
        data: {
          ...updateDto,
        },
      });
    } catch (error) {
      throw new HttpException('Incorrect dto', 400);
    }
  }
}
