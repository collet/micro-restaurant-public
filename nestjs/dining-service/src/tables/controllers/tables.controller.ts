import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import {
  ApiBody,
  ApiConflictResponse,
  ApiCreatedResponse,
  ApiNotFoundResponse, ApiOkResponse,
  ApiParam,
  ApiTags
} from '@nestjs/swagger';

import { AddTableDto } from '../dto/add-table.dto';
import { GetTableParams } from '../params/get-table.params';

import { Table } from '../schemas/table.schema';

import { TableAlreadyExistsException } from '../exceptions/table-already-exists.exception';
import { TableNumberNotFoundException } from '../exceptions/table-number-not-found.exception';

import { TablesService } from '../services/tables.service';

@ApiTags('tables')
@Controller('/tables')
export class TablesController {
  constructor(private readonly tablesService: TablesService) {}

  @Get()
  @ApiOkResponse({ type: Table, isArray: true })
  async listAllTables(): Promise<Table[]> {
    return this.tablesService.findAll();
  }

  @ApiParam({ name: 'tableNumber' })
  @Get(':tableNumber')
  @ApiOkResponse({ type: Table })
  @ApiNotFoundResponse({ type: TableNumberNotFoundException, description: 'Table not found' })
  async getTableByNumber(@Param() getTableParams: GetTableParams): Promise<Table> {
    return this.tablesService.findByNumber(getTableParams.tableNumber);
  }

  @ApiBody({ type: AddTableDto })
  @Post()
  @ApiCreatedResponse({ description: 'The table has been successfully added.', type: Table })
  @ApiConflictResponse({ type: TableAlreadyExistsException, description: 'Table already exists' })
  async addTable(@Body() addTableDto: AddTableDto) {
    return await this.tablesService.create(addTableDto);
  }
}
