import { HttpStatus } from '@nestjs/common';

import { ErrorDto } from '../../shared/dto/error.dto';

import { PreparationStateEnum } from '../schemas/preparation-state-enum.schema';

export class WrongQueryParameterException extends ErrorDto {
  constructor(preparationState: string) {
    super(HttpStatus.BAD_REQUEST, `Searching through preparations by state only support ${Object.keys(PreparationStateEnum).length} state names (${JSON.stringify(Object.values(PreparationStateEnum))})`, `"${preparationState}" is not a valid preparation state`);
  }
}
