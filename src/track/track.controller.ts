import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  Param,
  ParseUUIDPipe,
  Post,
  Put,
  Req,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { Request } from 'express';
import { TrackService } from './track.service';
import { TrackDto } from './dto/track.dto';

@Controller('track')
export class TrackController {
  constructor(private trackService: TrackService) {}

  @Get('')
  getAllUsers(@Req() req: Request) {
    return this.trackService.getAllTracks();
  }

  @Get(':id')
  getUserById(@Param('id', ParseUUIDPipe) id) {
    return this.trackService.getTrackById(id);
  }

  @Post('')
  postUser(@Body(new ValidationPipe({ whitelist: true })) dto: TrackDto) {
    return this.trackService.postTrack(dto);
  }

  @Delete(':id')
  @HttpCode(204)
  deleteUser(@Param('id', ParseUUIDPipe) id) {
    return this.trackService.deleteTrack(id);
  }

  @Put(':id')
  @UsePipes(
    new ValidationPipe({
      forbidNonWhitelisted: true,
      whitelist: true,
      transform: true,
    }),
  )
  update(@Param('id', ParseUUIDPipe) id, @Body() updateDto: TrackDto) {
    return this.trackService.updateTrack(id, updateDto);
  }
}
