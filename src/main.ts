import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { SwaggerModule } from '@nestjs/swagger';
import { readFile } from 'fs/promises';
import { parse } from 'yaml';
import * as path from 'path';
import { ConfigService } from '@nestjs/config';
import { MyLogger } from './logger/myLogger';
import * as express from 'express';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    abortOnError: false,
    logger: new MyLogger(),
  });
  app.use(express.json());
  const DOC_API = await readFile(
    path.join(__dirname, '../', 'doc', 'api.yaml'),
    'utf-8',
  );
  const document = parse(DOC_API);
  SwaggerModule.setup('doc', app, document);
  const config = new ConfigService();
  await app.listen(config.get('PORT'));
}

bootstrap();
process
  .on('unhandledRejection', (reason, p) => {
    console.error(reason, 'Unhandled Rejection at Promise', p);
  })
  .on('uncaughtException', (err) => {
    console.error(err, 'Uncaught Exception thrown');
    process.exit(1);
  });
