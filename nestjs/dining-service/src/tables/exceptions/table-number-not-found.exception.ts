import { HttpStatus } from '@nestjs/common';

import { ErrorDto } from '../../shared/dto/error.dto';

export class TableNumberNotFoundException extends ErrorDto {
  constructor(tableNumber: number) {
    super(HttpStatus.NOT_FOUND, 'Table not found', `"${tableNumber}" is not a valid table number`);
  }
}
