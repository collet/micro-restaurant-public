import { Module } from '@nestjs/common';

import { TablesWithOrderService } from './services/tables-with-order.service';
import { MongooseModule } from '@nestjs/mongoose';
import { TableOrder, TableOrderSchema } from '../table-orders/schemas/table-order.schema';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: TableOrder.name, schema: TableOrderSchema }]),
  ],
  providers: [
    TablesWithOrderService,
  ],
  exports: [TablesWithOrderService],
})
export class TablesWithOrderModule {}
