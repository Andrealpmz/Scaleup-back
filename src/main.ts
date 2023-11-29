import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(new ValidationPipe());

  // Configuración de los CORS
  app.enableCors({
    origin: ['https://scaleup.gracialab.co', 'http://localhost:5173'], 
    // allowedHeaders: ['Origin, X-Requested-With, Content-Type, Accept', 'Authorization'],
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true
  });

  await app.listen(process.env.PORT);
}
bootstrap();
