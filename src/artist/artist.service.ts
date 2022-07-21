import { PrismaService } from '../prisma/prisma.service';
import { ForbiddenException, Injectable } from '@nestjs/common';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime';
import { ArtistDto } from './dto/artist.dto';
import { v4 as uuid } from 'uuid';
import { HttpException } from '@nestjs/common/exceptions/http.exception';

@Injectable()
export class ArtistService {
  constructor(private prisma: PrismaService) {}

  async getAllArtists() {
    try {
      return await this.prisma.artist.findMany();
    } catch (error) {
      if (error instanceof PrismaClientKnownRequestError) {
        if (error.code === 'P2001') {
          throw new ForbiddenException('Artist not found');
        }
      }
      throw error;
    }
  }

  async getArtistById(id: string) {
    try {
      const artist = await this.prisma.artist.findUniqueOrThrow({
        where: {
          id: id,
        },
      });
      return artist;
    } catch (error) {
      throw new HttpException('Artist not found', 404);
    }
  }

  async postArtist(dto: ArtistDto) {
    const id: string = uuid();
    const data = {
      id: id,
      ...dto,
    };
    return await this.prisma.artist.create({
      data,
    });
  }

  async deleteArtist(id: string) {
    try {
      return await this.prisma.artist.delete({
        where: { id: id },
      });
    } catch (error) {
      throw new HttpException("User doesn't exist", 404);
    }
  }

  async updateArtist(id: string, updateDto: ArtistDto) {
    try {
      await this.prisma.artist.findUniqueOrThrow({
        where: {
          id: id,
        },
      });
    } catch (error) {
      throw new HttpException("Artist doesn't exist", 404);
    }

    return await this.prisma.artist.update({
      where: { id: id },
      data: {
        ...updateDto,
      },
    });
  }
}
