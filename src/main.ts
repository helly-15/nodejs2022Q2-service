import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { SwaggerModule } from '@nestjs/swagger';
import { readFile } from 'fs/promises';
import { parse } from 'yaml';
import * as path from 'path';
import { ConfigService } from '@nestjs/config';
//import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, { abortOnError: false });
  //app.useGlobalPipes(new ValidationPipe({ whitelist: true }));
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
