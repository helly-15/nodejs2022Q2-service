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
  Req, UseFilters,
  UsePipes,
  ValidationPipe
} from "@nestjs/common";
import { Request } from 'express';
import { ArtistService } from './artist.service';
import { ArtistDto } from './dto/artist.dto';
import { HttpExceptionFilter } from "../exceptions/http-exception.filter";
@UseFilters(new HttpExceptionFilter())
@Controller('artist')
export class ArtistController {
  constructor(private artistService: ArtistService) {}

  @Get('')
  getAllUsers(@Req() req: Request) {
    return this.artistService.getAllArtists();
  }

  @Get(':id')
  getUserById(@Param('id', ParseUUIDPipe) id) {
    return this.artistService.getArtistById(id);
  }

  @Post('')
  postUser(@Body(new ValidationPipe({ whitelist: true })) dto: ArtistDto) {
    return this.artistService.postArtist(dto);
  }

  @Delete(':id')
  @HttpCode(204)
  deleteUser(@Param('id', ParseUUIDPipe) id) {
    return this.artistService.deleteArtist(id);
  }

  @Put(':id')
  @UsePipes(
    new ValidationPipe({
      forbidNonWhitelisted: true,
      whitelist: true,
      transform: true,
    }),
  )
  update(@Param('id', ParseUUIDPipe) id, @Body() updateDto: ArtistDto) {
    return this.artistService.updateArtist(id, updateDto);
  }
}
