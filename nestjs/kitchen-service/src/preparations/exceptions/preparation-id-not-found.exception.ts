import { HttpStatus } from '@nestjs/common';

import { ErrorDto } from '../../shared/dto/error.dto';

export class PreparationIdNotFoundException extends ErrorDto {
  constructor(preparationId: string) {
    super(HttpStatus.NOT_FOUND, 'Preparation Id not found', `"${preparationId}" is not a valid preparation id`);
  }
}
