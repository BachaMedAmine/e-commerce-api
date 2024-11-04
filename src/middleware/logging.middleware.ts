import { Injectable, NestMiddleware } from '@nestjs/common';

@Injectable()
export class LoggingMiddleware implements NestMiddleware {
  use(req: any, res: any, next: () => void) {
    console.log(`Request... Method: ${req.method} URL: ${req.originalUrl}`);
    res.on('finish', () => {
      console.log(`Response... Status: ${res.statusCode}`);
    });
    next();
  }
}