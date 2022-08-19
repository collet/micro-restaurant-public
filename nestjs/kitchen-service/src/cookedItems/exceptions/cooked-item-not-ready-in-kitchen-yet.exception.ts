import { HttpStatus } from '@nestjs/common';

import { ErrorDto } from '../../shared/dto/error.dto';

import { CookedItem } from '../schemas/cooked-item.schema';

export class CookedItemNotReadyInKitchenYetException extends ErrorDto {
  constructor(cookedItem: CookedItem) {
    super(HttpStatus.UNPROCESSABLE_ENTITY, 'CookedItem not yet ready in the kitchen', `Cooked Item with id "${cookedItem._id}" should be ready at at ${(new Date(cookedItem.readyToServe)).toISOString()}`);
  }
}
