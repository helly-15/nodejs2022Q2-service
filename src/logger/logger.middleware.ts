import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { MyLogger } from './myLogger';

@Injectable()
export class LoggerMiddleware implements NestMiddleware {
  private logger = new MyLogger();

  use(request: Request, response: Response, next: NextFunction): void {
    const { method, originalUrl } = request;
    const reqBody = JSON.stringify(request.body) || ' ';
    const queryParams = JSON.stringify(request.query) || ' ';

    response.on('finish', () => {
      const { statusCode } = response;
      if (statusCode === 500) {
        this.logger.error(
          `
        Status Code: ${statusCode}
        Status message: ${response.statusMessage}
       `,
        );
        return;
      }
      if (statusCode >= 400) {
        this.logger.error(
          `
        Method: ${method}
        URL: ${originalUrl}
        Status Code: ${statusCode}
        Status message: ${response.statusMessage}
       `,
        );
        return;
      }
      this.logger.log(
        `
        Method: ${method}
        URL: ${originalUrl}
        Status Code: ${statusCode}
        Query parameters: ${queryParams} 
        Body: ${reqBody}`,
      );
    });

    next();
  }
}