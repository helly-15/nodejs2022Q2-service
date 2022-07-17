import {
  IsNotEmpty,
  IsNotEmptyObject,
  IsOptional,
  IsString,
} from 'class-validator';

export class TrackDto {
  @IsNotEmpty()
  name: string;

  @IsNotEmpty()
  duration: number;

  @IsOptional()
  artistId: string | null; // refers to Artist

  @IsOptional()
  albumId: string | null; // refers to Album
}
