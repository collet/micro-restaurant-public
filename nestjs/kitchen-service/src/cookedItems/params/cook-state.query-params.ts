import { IsEnum } from 'class-validator';

import { CookStateEnum } from '../schemas/cook-state-enum.schema';

export class CookStateQueryParams {
  @IsEnum(CookStateEnum)
  state: CookStateEnum;
}
