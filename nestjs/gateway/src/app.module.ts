import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

import appConfig from './shared/config/app.config';
import dependenciesConfig from './shared/config/dependencies.config';

import { HealthModule } from './health/health.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [appConfig, dependenciesConfig],
    }),
    HealthModule,
  ]
})
export class AppModule {}
