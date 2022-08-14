import { HttpStatus } from '@nestjs/common';

import { ErrorDto } from '../../shared/dto/error.dto';

export class MenuItemShortNameAlreadyExistsException extends ErrorDto {
  constructor(shortNameAlreadyTaken: string) {
    super(HttpStatus.CONFLICT, 'Menu short name already exists', `"${shortNameAlreadyTaken}" is already used`);
  }
}
