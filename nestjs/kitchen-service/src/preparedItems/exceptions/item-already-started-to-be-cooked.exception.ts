import { HttpStatus } from '@nestjs/common';

import { ErrorDto } from '../../shared/dto/error.dto';

import { PreparedItem } from '../schemas/prepared-item.schema';

export class ItemAlreadyStartedToBeCookedException extends ErrorDto {
  constructor(preparedItem: PreparedItem) {
    super(HttpStatus.UNPROCESSABLE_ENTITY, 'Item already started cooking inside the kitchen', `Item Id "${preparedItem._id}" is already started cooking inside the kitchen at ${(new Date(preparedItem.startedAt)).toISOString()}`);
  }
}
