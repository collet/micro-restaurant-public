import { HttpStatus } from '@nestjs/common';

import { ErrorDto } from '../../shared/dto/error.dto';

import { CookedItem } from '../schemas/cooked-item.schema';

export class CookedItemAlreadyTakenFromKitchenException extends ErrorDto {
  constructor(cookedItem: CookedItem) {
    super(HttpStatus.UNPROCESSABLE_ENTITY, 'CookedItem already taken from the kitchen', `Cooked Item with id "${cookedItem._id}" was already taken from the kitchen at ${(new Date(cookedItem.takenForService)).toISOString()}`);
  }
}
