import { IsNotEmpty, IsPositive } from 'class-validator';

import { OrderingLine } from '../schemas/ordering-line.schema';

export class ItemToBeCookedDto {
  @IsNotEmpty()
  menuItemShortName: string;

  @IsNotEmpty()
  @IsPositive()
  howMany: number;

  static itemToBeCookedDtoFactory(orderingLine: OrderingLine): ItemToBeCookedDto {
    const itemToBeCooked: ItemToBeCookedDto = new ItemToBeCookedDto();
    itemToBeCooked.menuItemShortName = orderingLine.item.shortName;
    itemToBeCooked.howMany = orderingLine.howMany;

    return itemToBeCooked;
  }
}
