import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

import { Table } from '../../tables/schemas/table.schema';

import { TableWithOrderDto } from '../dto/table-with-order.dto';

import { TableOrder, TableOrderDocument } from '../../table-orders/schemas/table-order.schema';

import { TableOrderTableNumberNotFoundException } from '../exceptions/table-order-table-number-not-found.exception';

@Injectable()
export class TablesWithOrderService {
  constructor(
    @InjectModel(TableOrder.name) private tableOrderModel: Model<TableOrderDocument>,
  ) {}

  async findForTable(tableNumber: number): Promise<TableOrder> {
    const tableOrders: TableOrder[] = await this.tableOrderModel.find({ tableNumber, 'billed': { $eq: null } }).lean();

    if (tableOrders.length === 0) {
      throw new TableOrderTableNumberNotFoundException(tableNumber);
    }

    return tableOrders[0];
  }

  async tableToTableWithOrder(table: Table): Promise<TableWithOrderDto> {
    let tableOrder: TableOrder = null;

    if (table.taken) {
      try {
        tableOrder = await this.findForTable(table.number);
      } catch (e) {
        tableOrder = null;
      }
    }

    return TableWithOrderDto.tableWithOrderDtoFactory(table, tableOrder);
  }
}
