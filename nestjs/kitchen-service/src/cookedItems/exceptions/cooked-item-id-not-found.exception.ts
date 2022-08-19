import { HttpStatus } from '@nestjs/common';

import { ErrorDto } from '../../shared/dto/error.dto';

export class CookedItemIdNotFoundException extends ErrorDto {
  constructor(cookedItemId: string) {
    super(HttpStatus.NOT_FOUND, 'Cooked Item not found', `"${cookedItemId}" is not a valid cooked item Id`);
  }
}
