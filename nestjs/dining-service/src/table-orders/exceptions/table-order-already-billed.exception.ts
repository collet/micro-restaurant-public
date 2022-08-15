import { HttpStatus } from '@nestjs/common';

import { ErrorDto } from '../../shared/dto/error.dto';

import { TableOrder } from '../schemas/table-order.schema';

export class TableOrderAlreadyBilledException extends ErrorDto {
  constructor(tableOrder: TableOrder) {
    super(HttpStatus.UNPROCESSABLE_ENTITY, 'TableOrder is already billed', `"${tableOrder._id}" is the Id of the table order (on table ${tableOrder.tableNumber}) already billed`);
  }
}
