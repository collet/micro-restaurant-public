import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';

import appConfig from './shared/config/app.config';
import mongodbConfig from './shared/config/mongodb.config';
import swaggeruiConfig from './shared/config/swaggerui.config';

import { MongooseConfigService } from './shared/services/mongoose-config.service';
import { StartupLogicService } from './shared/services/startup-logic.service';

import { TablesModule } from './tables/tables.module';
import { TableOrdersModule } from './table-orders/table-orders.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [appConfig, mongodbConfig, swaggeruiConfig],
    }),
    MongooseModule.forRootAsync({
      useClass: MongooseConfigService,
    }),
    TablesModule,
    TableOrdersModule,
  ],
  providers: [StartupLogicService],
})
export class AppModule {}
