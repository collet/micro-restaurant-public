import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

import { SwaggerUIConfig } from './config/interfaces/swaggerui-config.interface';

import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Retrieve config service
  const configService = app.get(ConfigService);

  // Add validation pipi for all endpoints
  app.useGlobalPipes(new ValidationPipe());

  // Swagger UI Definition
  const swaggeruiConfig = configService.get<SwaggerUIConfig>('swaggerui');
  const config = new DocumentBuilder()
    .setTitle(swaggeruiConfig.title)
    .setDescription(swaggeruiConfig.description)
    .setVersion(configService.get('npm_package_version'))
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup(swaggeruiConfig.path, app, document);

  // Run the app
  const appPort = configService.get('app.port');
  await app.listen(appPort);
}
bootstrap();
