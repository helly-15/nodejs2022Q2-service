import {
  IsNotEmpty
} from 'class-validator';

export class ArtistDto {
  @IsNotEmpty()
  name: string;

  @IsNotEmpty()
  grammy: boolean;
}
