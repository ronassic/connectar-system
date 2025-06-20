import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { AppModule } from './modules/app.module';
import { ConfigService } from '@nestjs/config';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // 1. ⚠️ Configure o PREFIXO ANTES de tudo
  app.setGlobalPrefix('api');  

  // 2. ✅ Swagger SEM prefixo
  const config = new DocumentBuilder()
    .setTitle('User Management API')
    .setDescription('API for user management with authentication')
    .setVersion('1.0')
    .addBearerAuth()
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('docs', app, document); // Aqui é /docs mesmo

  // 3. CORS e Validations
  const configService = app.get(ConfigService);
  const allowedOrigins = configService.get<string>('FRONTEND_ORIGINS')?.split(',') || [];

  app.enableCors({
    origin: allowedOrigins,
    credentials: true,
  });

  app.useGlobalPipes(new ValidationPipe());

  await app.listen(3000, '0.0.0.0');
  // Aplicação NestJS ouvindo na porta 3000
}
bootstrap();
