import { HttpStatus } from '@nestjs/common';

import { ErrorDto } from '../../shared/dto/error.dto';

import { Preparation } from '../schemas/preparation.schema';

export class PreparationAlreadyTakenFromKitchenException extends ErrorDto {
  constructor(preparation: Preparation) {
    super(HttpStatus.UNPROCESSABLE_ENTITY, 'Preparation already taken from the kitchen', `Preparation with Id "${preparation._id}" is already taken from the kitchen`);
  }
}
