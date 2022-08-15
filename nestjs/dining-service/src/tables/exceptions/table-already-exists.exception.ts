import { HttpStatus } from '@nestjs/common';

import { ErrorDto } from '../../shared/dto/error.dto';

export class TableAlreadyExistsException extends ErrorDto {
  constructor(tableNumber: number) {
    super(HttpStatus.CONFLICT, 'Table number already exists', `"${tableNumber}" is already used`);
  }
}
