import { HttpStatus } from '@nestjs/common';

import { ErrorDto } from '../../shared/dto/error.dto';

export class ItemsToBeCookedNotFoundException extends ErrorDto {
  constructor(unknownShortNames: String[]) {
    super(HttpStatus.UNPROCESSABLE_ENTITY, 'Some item names not found by the kitchen', `{${unknownShortNames.join(', ')}} are not known`);
  }
}
