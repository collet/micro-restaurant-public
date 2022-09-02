import { HttpStatus } from '@nestjs/common';

import { ErrorDto } from '../../shared/dto/error.dto';

export class TableOrderTableNumberNotFoundException extends ErrorDto {
  constructor(tableNumber: number) {
    super(HttpStatus.NOT_FOUND, 'Table order not found', `No table order found for table number "${tableNumber}"`);
  }
}
