import { Injectable } from '@nestjs/common';
import { MyLogger } from './logger/myLogger';

@Injectable()
export class AppService {
  logger: MyLogger;
  constructor() {
    this.logger = new MyLogger();
  }
  getHello(): string {
    this.logger.log('test');
    return 'Hello World!';
  }
}
