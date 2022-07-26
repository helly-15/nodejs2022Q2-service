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
