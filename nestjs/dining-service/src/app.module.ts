import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';

import appConfig from './shared/config/app.config';
import mongodbConfig from './shared/config/mongodb.config';
import swaggeruiConfig from './shared/config/swaggerui.config';
import dependenciesConfig from './shared/config/dependencies.config';

import { MongooseConfigService } from './shared/services/mongoose-config.service';
import { StartupLogicService } from './shared/services/startup-logic.service';

import { HealthModule } from './health/health.module';
import { TablesModule } from './tables/tables.module';
import { TableOrdersModule } from './table-orders/table-orders.module';
import { TablesWithOrderModule } from './tables-with-order/tables-with-order.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [appConfig, mongodbConfig, swaggeruiConfig, dependenciesConfig],
    }),
    MongooseModule.forRootAsync({
      useClass: MongooseConfigService,
    }),
    HealthModule,
    TablesModule,
    TableOrdersModule,
    TablesWithOrderModule,
  ],
  providers: [StartupLogicService],
})
export class AppModule {}
