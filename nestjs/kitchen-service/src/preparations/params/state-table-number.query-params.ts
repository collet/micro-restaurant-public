import { IsEnum, IsNumberString, IsOptional } from 'class-validator';

import { PreparationStateEnum } from '../schemas/preparation-state-enum.schema';

export class StateTableNumberQueryParams {
  @IsEnum(PreparationStateEnum)
  state: PreparationStateEnum;

  @IsNumberString()
  @IsOptional()
  tableNumber: number;
}
