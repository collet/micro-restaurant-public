import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { MongooseModuleOptions, MongooseOptionsFactory } from '@nestjs/mongoose';

import { MongoDBConfig } from '../config/interfaces/mongodb-config.interface';

@Injectable()
export class MongooseConfigService implements MongooseOptionsFactory {
  constructor(private configService: ConfigService) {}

  createMongooseOptions(): MongooseModuleOptions {
    const mongodbConfig = this.configService.get<MongoDBConfig>('mongodb');
    return {
      uri: `mongodb://${mongodbConfig.host}:${mongodbConfig.port}/${mongodbConfig.database}`,
    };
  }
}
