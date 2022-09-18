import { IsMongoId, IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class PreparedItemDto {
  @ApiProperty()
  @IsMongoId()
  _id: string;

  @ApiProperty()
  @IsNotEmpty()
  shortName: string;

  static kitchenPreparedItemToPreparedItemDtoFactory(kitchenPreparedItem): PreparedItemDto {
    const preparedItem: PreparedItemDto = new PreparedItemDto();
    preparedItem._id = kitchenPreparedItem._id;
    preparedItem.shortName = kitchenPreparedItem.shortName;

    return preparedItem;
  }
}
