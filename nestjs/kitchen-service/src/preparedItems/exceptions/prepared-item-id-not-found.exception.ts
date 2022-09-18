import { HttpStatus } from '@nestjs/common';

import { ErrorDto } from '../../shared/dto/error.dto';

export class PreparedItemIdNotFoundException extends ErrorDto {
  constructor(preparedItemId: string) {
    super(HttpStatus.NOT_FOUND, 'Prepared Item Id not found', `"${preparedItemId}" is not a valid prepared item id`);
  }
}
