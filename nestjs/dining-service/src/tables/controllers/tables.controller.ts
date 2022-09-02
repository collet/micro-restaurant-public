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
import { TableWithOrderDto } from '../../tables-with-order/dto/table-with-order.dto';
import { GetTableParams } from '../params/get-table.params';

import { TableAlreadyExistsException } from '../exceptions/table-already-exists.exception';
import { TableNumberNotFoundException } from '../exceptions/table-number-not-found.exception';

import { TablesService } from '../services/tables.service';

@ApiTags('tables')
@Controller('/tables')
export class TablesController {
  constructor(private readonly tablesService: TablesService) {}

  @ApiOkResponse({ type: TableWithOrderDto, isArray: true })
  @Get()
  async listAllTables(): Promise<TableWithOrderDto[]> {
    return this.tablesService.findAll();
  }

  @ApiParam({ name: 'tableNumber' })
  @ApiOkResponse({ type: TableWithOrderDto })
  @ApiNotFoundResponse({ type: TableNumberNotFoundException, description: 'Table not found' })
  @Get(':tableNumber')
  async getTableByNumber(@Param() getTableParams: GetTableParams): Promise<TableWithOrderDto> {
    return this.tablesService.findByNumber(getTableParams.tableNumber);
  }

  @ApiBody({ type: AddTableDto })
  @ApiCreatedResponse({ type: TableWithOrderDto, description: 'The table has been successfully added.' })
  @ApiConflictResponse({ type: TableAlreadyExistsException, description: 'Table already exists' })
  @Post()
  async addTable(@Body() addTableDto: AddTableDto): Promise<TableWithOrderDto> {
    return await this.tablesService.create(addTableDto);
  }
}
