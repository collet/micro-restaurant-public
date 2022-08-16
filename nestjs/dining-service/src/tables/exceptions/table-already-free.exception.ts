import { HttpStatus } from '@nestjs/common';

import { ErrorDto } from '../../shared/dto/error.dto';

export class TableAlreadyFreeException extends ErrorDto {
  constructor(tableNumber: number) {
    super(HttpStatus.UNPROCESSABLE_ENTITY, 'Table is already free', `"${tableNumber}" is the number of a table already free`);
  }
}
