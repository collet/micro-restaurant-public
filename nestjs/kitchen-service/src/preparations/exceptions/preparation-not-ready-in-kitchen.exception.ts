import { HttpStatus } from '@nestjs/common';

import { ErrorDto } from '../../shared/dto/error.dto';

import { Preparation } from '../schemas/preparation.schema';

export class PreparationNotReadyInKitchenException extends ErrorDto {
  constructor(preparation: Preparation) {
    super(HttpStatus.UNPROCESSABLE_ENTITY, 'Preparation not yet ready in the kitchen', `Preparation with Id "${preparation._id}" not yet ready in the kitchen`);
  }
}
