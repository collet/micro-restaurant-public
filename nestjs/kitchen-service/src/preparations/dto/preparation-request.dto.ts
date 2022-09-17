import { ArrayNotEmpty, IsArray, IsNotEmpty, IsNumberString } from 'class-validator';

import { ItemToBeCookedDto } from './item-to-be-cooked.dto';

export class PreparationRequestDto {
  @IsNumberString()
  tableNumber: number;

  @ArrayNotEmpty()
  @IsArray({ each: true })
  itemsToBeCooked: ItemToBeCookedDto[];
}
