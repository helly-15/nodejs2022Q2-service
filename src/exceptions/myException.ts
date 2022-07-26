import { HttpStatus } from '@nestjs/common';
import { HttpException } from '@nestjs/common/exceptions/http.exception';

export class CustomException extends HttpException {
  constructor(message: string | Record<string, any>, code: number) {
    super(message, code);
  }
}
