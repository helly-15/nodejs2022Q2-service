import { IsNotEmpty, IsNotEmptyObject, IsString } from 'class-validator';

export class CreateUserDto {
  @IsString()
  @IsNotEmpty()
  login: string;
  @IsNotEmpty()
  @IsString()
  password: string;
}

export class UpdateDto {
  @IsString()
  @IsNotEmpty()
  oldPassword: string;
  @IsString()
  @IsNotEmpty()
  newPassword: string;
}
