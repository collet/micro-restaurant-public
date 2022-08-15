import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

import { Table, TableDocument } from '../schemas/table.schema';

import { AddTableDto } from '../dto/add-table.dto';

import { TableAlreadyExistsException } from '../exceptions/table-already-exists.exception';
import { TableNumberNotFoundException } from '../exceptions/table-number-not-found.exception';
import { TableAlreadyTakenException } from '../exceptions/table-already-taken.exception';

@Injectable()
export class TablesService {
  constructor(@InjectModel(Table.name) private tableModel: Model<TableDocument>) {}

  async findAll(): Promise<Table[]> {
    return this.tableModel.find().lean();
  }

  async findByNumber(tableNumber: number): Promise<Table> {
    const foundItem = await this.tableModel.findOne({ number: tableNumber }).lean();

    if (foundItem === null) {
      throw new TableNumberNotFoundException(tableNumber);
    }

    return foundItem;
  }

  async create(addTableDto: AddTableDto): Promise<Table> {
    const alreadyExists = await this.tableModel.find({ number: addTableDto.number });
    if (alreadyExists.length > 0) {
      throw new TableAlreadyExistsException(addTableDto.number);
    }
    return await this.tableModel.create(addTableDto);
  }

  async takeTable(tableNumber: number): Promise<Table> {
    const table:Table = await this.findByNumber(tableNumber);

    if (table.taken) {
      throw new TableAlreadyTakenException(tableNumber);
    }

    return this.tableModel.findByIdAndUpdate(table._id, { taken: true });
  }
}
