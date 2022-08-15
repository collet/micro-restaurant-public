import { OnApplicationBootstrap } from '@nestjs/common';
import { InjectConnection } from '@nestjs/mongoose';
import { Connection } from 'mongoose';

import { AddTableDto } from '../../tables/dto/add-table.dto';

export class StartupLogicService implements OnApplicationBootstrap {
  constructor(@InjectConnection() private connection: Connection) {}

  createTable(number: number): AddTableDto {
    const table: AddTableDto = new AddTableDto();
    table.number = number;
    return table;
  }

  async addTable(number: number) {
    const tableModel = this.connection.models['Table'];

    const alreadyExists = await tableModel.find({ number });
    if (alreadyExists.length > 0) {
      throw new Error('Table already exists.');
    }

    return tableModel.create(this.createTable(number));
  }

  async onApplicationBootstrap() {
    try {
      await this.addTable(1);
      await this.addTable(2);
      await this.addTable(3);
    } catch (e) {
    }
  }
}
