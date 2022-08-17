import { HttpStatus } from '@nestjs/common';

import { ErrorDto } from '../../shared/dto/error.dto';

export class ItemToBeCookedNotFoundException extends ErrorDto {
  constructor(menuItemShortName: string) {
    super(HttpStatus.NOT_FOUND, 'Item to be cooked is not known by the kitchen', `"${menuItemShortName}" is not known`);
  }
}
