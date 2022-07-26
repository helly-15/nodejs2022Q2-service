import { LoggerService } from '@nestjs/common';
import * as fs from 'fs';

export class MyLogger implements LoggerService {
  /**
   * Write a 'log' level log.
   */
  log(message: any, ...optionalParams: any[]) {
    fs.appendFile('logs.txt', message, (err) => {
      if (err) {
        console.error(err);
      }
    });
    console.log(message + ' ---- find the same message in file logs.txt');
  }

  /**
   * Write an 'error' level log.
   */
  error(message: any, ...optionalParams: any[]) {
    fs.appendFile('errors.txt', message, (err) => {
      if (err) {
        console.error(err);
      }
    });
    console.log(message + ' ---- find the same message in file errors.txt');
  }

  /**
   * Write a 'warn' level log.
   */
  warn(message: any, ...optionalParams: any[]) {
    console.log(message);
  }

  /**
   * Write a 'debug' level log.
   */
  debug?(message: any, ...optionalParams: any[]) {
    console.log(message);
  }

  /**
   * Write a 'verbose' level log.
   */
  verbose?(message: any, ...optionalParams: any[]) {
    console.log(message);
  }
}
