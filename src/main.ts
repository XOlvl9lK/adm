import { LoggerService } from '@common/logger/logger.service';
import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    logger: new LoggerService('NestApplication'),
  });
  app.enableCors({
    origin: true,
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
    credentials: true,
    exposedHeaders: ['Content-Disposition'],
  });
  const swaggerConfig = new DocumentBuilder()
    .setTitle('ГАС ПС Интеграции')
    .setDescription('Модуль Настройки внешних взаимодействий')
    .setVersion('1.0')
    .build();
  app.useGlobalPipes(new ValidationPipe({ whitelist: true }));
  const document = SwaggerModule.createDocument(app, swaggerConfig);
  SwaggerModule.setup('swagger', app, document);
  await app.listen(+process.env.APP_PORT || 3000, () => {
    console.log(`server started port=${process.env.APP_PORT}`);
  });
}

bootstrap();
