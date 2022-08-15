import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { TableOrder, TableOrderSchema } from './schemas/table-order.schema';

import { TableOrdersController } from './controllers/table-orders.controller';
import { TableOrdersService } from './services/table-orders.service';

import { TablesModule } from '../tables/tables.module';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: TableOrder.name, schema: TableOrderSchema }]),
    TablesModule,
  ],
  controllers: [TableOrdersController],
  providers: [TableOrdersService],
})
export class TableOrdersModule {}
