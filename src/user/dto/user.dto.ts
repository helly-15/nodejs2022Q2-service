import { IsNotEmpty, IsString } from 'class-validator';

export class UserDto {
  @IsString()
  @IsNotEmpty()
  login: string;
  @IsNotEmpty()
  @IsString()
  password: string;
}
