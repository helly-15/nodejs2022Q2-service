import { PrismaService } from '../prisma/prisma.service';
import { ForbiddenException, Injectable } from '@nestjs/common';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime';
import { TrackDto } from './dto/track.dto';
import { v4 as uuid } from 'uuid';
import { HttpException } from '@nestjs/common/exceptions/http.exception';
import { CustomException } from '../exceptions/myException';

@Injectable()
export class TrackService {
  constructor(private prisma: PrismaService) {}

  async getAllTracks() {
    try {
      return await this.prisma.track.findMany();
    } catch (error) {
      if (error instanceof PrismaClientKnownRequestError) {
        if (error.code === 'P2001') {
          throw new ForbiddenException('Track not found');
        }
      }
      throw error;
    }
  }

  async getTrackById(id: string) {
    try {
      const track = await this.prisma.track.findUniqueOrThrow({
        where: {
          id: id,
        },
      });
      return track;
    } catch (error) {
      throw new CustomException('Track not found', 404);
    }
  }

  async postTrack(dto: TrackDto) {
    const id: string = uuid();
    const data = {
      id: id,
      ...dto,
    };
    return await this.prisma.track.create({
      data,
    });
  }

  async deleteTrack(id: string) {
    try {
      return await this.prisma.track.delete({
        where: { id: id },
      });
    } catch (error) {
      throw new CustomException("User doesn't exist", 404);
    }
  }

  async updateTrack(id: string, updateDto: TrackDto) {
    try {
      await this.prisma.track.findUniqueOrThrow({
        where: {
          id: id,
        },
      });
    } catch (error) {
      throw new CustomException("Track doesn't exist", 404);
    }

    return await this.prisma.track.update({
      where: { id: id },
      data: {
        ...updateDto,
      },
    });
  }
}
