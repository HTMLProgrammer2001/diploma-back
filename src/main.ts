import {NestFactory} from '@nestjs/core';
import {ValidationPipe} from '@nestjs/common';
import {AppModule} from './app.module';
import {graphqlUploadExpress} from 'graphql-upload';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(new ValidationPipe({transform: true, stopAtFirstError: true}));
  app.use(graphqlUploadExpress({maxFileSize: 10000000, maxFiles: 10}));

  await app.listen(3000);
}

bootstrap();
