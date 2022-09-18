import { HttpStatus } from '@nestjs/common';

import { ErrorDto } from '../../shared/dto/error.dto';

import { PreparedItem } from '../schemas/prepared-item.schema';

export class ItemAlreadyFinishedToBeCookedException extends ErrorDto {
  constructor(preparedItem: PreparedItem) {
    super(HttpStatus.UNPROCESSABLE_ENTITY, 'Item already finished of being cooked in the kitchen', `Item Id "${preparedItem._id}" is already finished of being cooked in the kitchen at ${(new Date(preparedItem.finishedAt)).toISOString()}`);
  }
}
