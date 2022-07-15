import { Module } from '@nestjs/common';
import { UserController } from './user.controler';

@Module({ controllers: [UserController] })
export class UserModule {}
