import { HttpStatus } from '@nestjs/common';

import { ErrorDto } from '../../shared/dto/error.dto';

import { PreparedItem } from '../schemas/prepared-item.schema';

export class ItemNotStartedToBeCookedException extends ErrorDto {
  constructor(preparedItem: PreparedItem) {
    super(HttpStatus.UNPROCESSABLE_ENTITY, 'Item not started to be cooked inside the kitchen', `Item Id "${preparedItem._id}" is not started to be cooked inside the kitchen`);
  }
}
