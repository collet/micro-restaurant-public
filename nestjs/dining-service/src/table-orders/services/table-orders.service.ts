import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

import { Table } from '../../tables/schemas/table.schema';
import { TableOrder, TableOrderDocument } from '../schemas/table-order.schema';

import { StartOrderingDto } from '../dto/start-ordering.dto';

import { TablesService } from '../../tables/services/tables.service';

@Injectable()
export class TableOrdersService {
  constructor(@InjectModel(TableOrder.name) private tableOrderModel: Model<TableOrderDocument>, private readonly tablesService: TablesService) {}

  async startOrdering(startOrderingDto: StartOrderingDto): Promise<TableOrder> {
    const table: Table = await this.tablesService.takeTable(startOrderingDto.tableNumber);

    const tableOrder: TableOrder = new TableOrder();
    tableOrder.tableNumber = table.number;
    tableOrder.customersCount = startOrderingDto.customersCount;
    tableOrder.opened = new Date();

    return await this.tableOrderModel.create(tableOrder);
  }
}
