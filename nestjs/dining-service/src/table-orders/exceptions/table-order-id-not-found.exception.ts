import { HttpStatus } from '@nestjs/common';

import { ErrorDto } from '../../shared/dto/error.dto';

export class TableOrderIdNotFoundException extends ErrorDto {
  constructor(tableOrderId: string) {
    super(HttpStatus.NOT_FOUND, 'Table order not found', `"${tableOrderId}" is not a valid table order Id`);
  }
}
