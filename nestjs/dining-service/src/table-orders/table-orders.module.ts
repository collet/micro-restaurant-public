import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { HttpModule } from '@nestjs/axios';

import { TableOrder, TableOrderSchema } from './schemas/table-order.schema';

import { TableOrdersController } from './controllers/table-orders.controller';
import { TableOrdersService } from './services/table-orders.service';
import { MenuProxyService } from './services/menu-proxy.service';

import { TablesModule } from '../tables/tables.module';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: TableOrder.name, schema: TableOrderSchema }]),
    HttpModule,
    TablesModule,
  ],
  controllers: [TableOrdersController],
  providers: [
    TableOrdersService,
    MenuProxyService,
  ],
})
export class TableOrdersModule {}
