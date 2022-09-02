import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

import { Table, TableDocument } from '../schemas/table.schema';

import { AddTableDto } from '../dto/add-table.dto';
import { TableWithOrderDto } from '../../tables-with-order/dto/table-with-order.dto';

import { TableAlreadyExistsException } from '../exceptions/table-already-exists.exception';
import { TableNumberNotFoundException } from '../exceptions/table-number-not-found.exception';
import { TableAlreadyTakenException } from '../exceptions/table-already-taken.exception';
import { TableAlreadyFreeException } from '../exceptions/table-already-free.exception';
import { TablesWithOrderService } from '../../tables-with-order/services/tables-with-order.service';

@Injectable()
export class TablesService {
  constructor(
    @InjectModel(Table.name) private tableModel: Model<TableDocument>,
    private readonly tablesWithOrderService: TablesWithOrderService,
  ) {}

  async findAll(): Promise<TableWithOrderDto[]> {
    const allTables: Table[] = await this.tableModel.find().lean();

    const allTablesWithOrder = allTables.map((table) => (
      this.tablesWithOrderService.tableToTableWithOrder(table)
    ));

    return Promise.all(allTablesWithOrder);
  }

  async findByNumber(tableNumber: number): Promise<TableWithOrderDto> {
    const foundItem = await this.tableModel.findOne({ number: tableNumber }).lean();

    if (foundItem === null) {
      throw new TableNumberNotFoundException(tableNumber);
    }

    return this.tablesWithOrderService.tableToTableWithOrder(foundItem);
  }

  async create(addTableDto: AddTableDto): Promise<TableWithOrderDto> {
    const alreadyExists = await this.tableModel.find({ number: addTableDto.number });
    if (alreadyExists.length > 0) {
      throw new TableAlreadyExistsException(addTableDto.number);
    }
    const newTable: Table = await this.tableModel.create(addTableDto);

    return this.tablesWithOrderService.tableToTableWithOrder(newTable);
  }

  async takeTable(tableNumber: number): Promise<Table> {
    const table:Table = await this.findByNumber(tableNumber);

    if (table.taken) {
      throw new TableAlreadyTakenException(tableNumber);
    }

    table.taken = true;

    return this.tableModel.findByIdAndUpdate(table._id, table, { returnDocument: 'after' });
  }

  async releaseTable(tableNumber: number): Promise<Table> {
    const table:Table = await this.findByNumber(tableNumber);

    if (!table.taken) {
      throw new TableAlreadyFreeException(tableNumber);
    }

    table.taken = false;

    return this.tableModel.findByIdAndUpdate(table._id, table, { returnDocument: 'after' });
  }
}
