import { ArrayNotEmpty, IsArray, IsNumber } from 'class-validator';

import { ItemToBeCookedDto } from './item-to-be-cooked.dto';

export class PreparationRequestDto {
  @IsNumber()
  tableNumber: number;

  @ArrayNotEmpty()
  @IsArray()
  itemsToBeCooked: ItemToBeCookedDto[];
}
