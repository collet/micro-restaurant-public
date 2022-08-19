import { HttpStatus } from '@nestjs/common';

import { ErrorDto } from '../../shared/dto/error.dto';

import { CookStateEnum } from '../schemas/cook-state-enum.schema';

export class WrongQueryParameterException extends ErrorDto {
  constructor(cookState: string) {
    super(HttpStatus.BAD_REQUEST, `Searching through cookedItems by state only support ${Object.keys(CookStateEnum).length} state names (${JSON.stringify(Object.values(CookStateEnum))})`, `"${cookState}" is not a valid cook state`);
  }
}
