import { NestFactory } from '@nestjs/core';
import { ConfigService } from '@nestjs/config';
import { createProxyMiddleware } from 'http-proxy-middleware';

import { DependenciesConfig } from './shared/config/interfaces/dependencies-config.interface';

import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors();

  // Retrieve config service
  const configService = app.get(ConfigService);

  // Starts listening for shutdown hooks
  app.enableShutdownHooks();

  // Proxy endpoints
  const dependenciesConfig = configService.get<DependenciesConfig>('dependencies');
  app.use('/menu', createProxyMiddleware({
    target: `http://${dependenciesConfig.menu_service_url_with_port}`,
    changeOrigin: true,
    pathRewrite: {
      [`^/menu`]: '',
    }
  }));
  app.use('/kitchen', createProxyMiddleware({
    target: `http://${dependenciesConfig.kitchen_service_url_with_port}`,
    changeOrigin: true,
    pathRewrite: {
      [`^/kitchen`]: '',
    }
  }));
  app.use('/dining', createProxyMiddleware({
    target: `http://${dependenciesConfig.dining_service_url_with_port}`,
    changeOrigin: true,
    pathRewrite: {
      [`^/dining`]: '',
    }
  }));

  // Run the app
  const appPort = configService.get('app.port');
  await app.listen(appPort);
}
bootstrap();
