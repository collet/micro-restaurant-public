import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';

import appConfig from './config/app.config';
import mongodbConfig from './config/mongodb.config';
import swaggeruiConfig from './config/swaggerui.config';

import { MongooseConfigService } from './mongoose-config.service';

import { MenusModule } from './menus/menus.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [appConfig, mongodbConfig, swaggeruiConfig],
    }),
    MongooseModule.forRootAsync({
      useClass: MongooseConfigService,
    }),
    MenusModule,
  ],
})
export class AppModule {}
