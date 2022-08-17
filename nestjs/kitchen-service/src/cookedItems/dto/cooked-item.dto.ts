import { IsDate, IsMongoId, IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

import { CookedItem } from '../schemas/cooked-item.schema';

export class CookedItemDto {
  @ApiProperty()
  @IsMongoId()
  _id: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsDate()
  readyToServe: Date;

  static cookedItemDTOFactory(cookedItem: CookedItem): CookedItemDto {
    const cookedItemDto: CookedItemDto = new CookedItemDto();
    cookedItemDto._id = cookedItem._id;
    cookedItemDto.readyToServe = cookedItem.readyToServe;

    return cookedItemDto;
  }

  static cookedItemDTOFactoryList(cookedItems: CookedItem[]): CookedItemDto[] {
    return cookedItems.map((cookedItem) => CookedItemDto.cookedItemDTOFactory(cookedItem));
  }
}
