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
    } catch (e) {
    }
    try {
      await this.addTable(2);
    } catch (e) {
    }
    try {
      await this.addTable(3);
    } catch (e) {
    }
    try {
      await this.addTable(4);
    } catch (e) {
    }
    try {
      await this.addTable(5);
    } catch (e) {
    }
    try {
      await this.addTable(6);
    } catch (e) {
    }
    try {
      await this.addTable(7);
    } catch (e) {
    }
    try {
      await this.addTable(8);
    } catch (e) {
    }
    try {
      await this.addTable(9);
    } catch (e) {
    }
    try {
      await this.addTable(10);
    } catch (e) {
    }
    try {
      await this.addTable(11);
    } catch (e) {
    }
    try {
      await this.addTable(12);
    } catch (e) {
    }
    try {
      await this.addTable(13);
    } catch (e) {
    }
    try {
      await this.addTable(14);
    } catch (e) {
    }
    try {
      await this.addTable(15);
    } catch (e) {
    }
  }
}
