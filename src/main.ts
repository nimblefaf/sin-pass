import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';

import * as cookieParser from 'cookie-parser';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

import * as bcrypt from 'bcrypt';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.useGlobalPipes(new ValidationPipe({ whitelist: true }));

  const config = new DocumentBuilder()
    .setTitle('API корпоративного менеджера паролей')
    .setDescription('Документация по всем эндпоинтам: Auth, Users, Credentials, Access, Audit')
    .setVersion('1.0')
    .addBearerAuth({        // Добавляем возможность вводить JWT в Swagger UI
      type: 'http',
      scheme: 'bearer',
      bearerFormat: 'JWT',
      name: 'Authorization',
      description: 'Введите JWT-токен в формате “<token>”',
      in: 'header',
    }, 'access-token')
    .addSecurityRequirements('bearer')
    .build();

    const document = SwaggerModule.createDocument(app, config);
  // Монтируем Swagger UI по пути /api-docs (можно изменить на /docs и т. д.)
  SwaggerModule.setup('api-docs', app, document, {
    swaggerOptions: {
      persistAuthorization: true, // чтобы токен не стирался при переключении страниц
    },
  });

  app.use(cookieParser());
  //console.log(bcrypt.hashSync('admin', 10))
  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
