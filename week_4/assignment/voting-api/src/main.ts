import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as dotenv from "dotenv";
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
dotenv.config();

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const config = new DocumentBuilder()
    .setTitle('Api Example')
    .setDescription('The api description')
    .setVersion('1.0')
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  const corsOptions = {
    origin: '*',
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    preflightContinue: false,
    allowedHeaders: 'Content-Type, Accept, Authorization',
  };
  app.enableCors(corsOptions)

  await app.listen(process.env.PORT || 3000);
}
bootstrap();
