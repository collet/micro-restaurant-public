import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { Table, TableSchema } from './schemas/table.schema';

import { TablesWithOrderModule } from '../tables-with-order/tables-with-order.module';

import { TablesController } from './controllers/tables.controller';

import { TablesService } from './services/tables.service';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Table.name, schema: TableSchema }]),
    TablesWithOrderModule,
  ],
  controllers: [TablesController],
  providers: [TablesService],
  exports: [TablesService],
})
export class TablesModule {}
