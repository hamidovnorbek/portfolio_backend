import { DocumentBuilder } from '@nestjs/swagger';

export const docOptionsBuilder = () =>
  new DocumentBuilder()
    .addBearerAuth({
      description: 'Default JWT Authorization',
      type: 'http',
      in: 'header',
      scheme: 'bearer',
      bearerFormat: 'JWT',
    })
    .setVersion('1.0')
    .addGlobalParameters({
      in: 'header',
      name: 'Accept-Language',
      example: 'uz',
    });
