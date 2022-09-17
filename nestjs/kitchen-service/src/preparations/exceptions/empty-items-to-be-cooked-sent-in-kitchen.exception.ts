import { HttpStatus } from '@nestjs/common';

import { ErrorDto } from '../../shared/dto/error.dto';

export class EmptyItemsToBeCookedSentInKitchenException extends ErrorDto {
  constructor(tableNumber: number) {
    super(HttpStatus.UNPROCESSABLE_ENTITY, 'Empty item list sent to the kitchen', `Empty item list sent to the kitchen from table number "${tableNumber}"`);
  }
}
