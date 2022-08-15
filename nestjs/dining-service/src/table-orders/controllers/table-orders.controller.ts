import { Body, Controller, Post } from '@nestjs/common';
import {
  ApiBody,
  ApiUnprocessableEntityResponse,
  ApiCreatedResponse,
  ApiNotFoundResponse,
  ApiTags,
} from '@nestjs/swagger';

import { StartOrderingDto } from '../dto/start-ordering.dto';

import { TableOrder } from '../schemas/table-order.schema';

import { TableAlreadyTakenException } from '../../tables/exceptions/table-already-taken.exception';
import { TableNumberNotFoundException } from '../../tables/exceptions/table-number-not-found.exception';

import { TableOrdersService } from '../services/table-orders.service';

@ApiTags('tableOrders')
@Controller('/tableOrders')
export class TableOrdersController {
  constructor(private readonly tableOrdersService: TableOrdersService) {}

  @ApiBody({ type: StartOrderingDto })
  @Post()
  @ApiCreatedResponse({ description: 'The table has been successfully opened.', type: TableOrder })
  @ApiNotFoundResponse({ type: TableNumberNotFoundException, description: 'Table not found' })
  @ApiUnprocessableEntityResponse({ type: TableAlreadyTakenException, description: 'Table is already taken' })
  async openTable(@Body() startOrderingDto: StartOrderingDto) {
    return await this.tableOrdersService.startOrdering(startOrderingDto);
  }
}
