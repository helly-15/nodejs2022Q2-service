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
import { AlbumService } from './album.service';
import { AlbumDto } from './dto/album.dto';

@Controller('Album')
export class AlbumController {
  constructor(private albumService: AlbumService) {}

  @Get('')
  getAllUsers(@Req() req: Request) {
    return this.albumService.getAllAlbums();
  }

  @Get(':id')
  getUserById(@Param('id', ParseUUIDPipe) id) {
    return this.albumService.getAlbumById(id);
  }

  @Post('')
  postUser(@Body(new ValidationPipe({ whitelist: true })) dto: AlbumDto) {
    return this.albumService.postAlbum(dto);
  }

  @Delete(':id')
  @HttpCode(204)
  deleteUser(@Param('id', ParseUUIDPipe) id) {
    return this.albumService.deleteAlbum(id);
  }

  @Put(':id')
  @UsePipes(
    new ValidationPipe({
      forbidNonWhitelisted: true,
      whitelist: true,
      transform: true,
    }),
  )
  update(@Param('id', ParseUUIDPipe) id, @Body() updateDto: AlbumDto) {
    return this.albumService.updateAlbum(id, updateDto);
  }
}
