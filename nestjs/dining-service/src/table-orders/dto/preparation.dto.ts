import { ArrayNotEmpty, IsArray, IsDateString, IsMongoId, IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { PreparedItemDto } from './prepared-item.dto';
import { OrderingLine } from '../schemas/ordering-line.schema';

export class PreparationDto {
  @ApiProperty()
  @IsMongoId()
  _id: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsDateString()
  shouldBeReadyAt: string;

  @ApiProperty()
  @ArrayNotEmpty()
  @IsArray({ each: true })
  preparedItems: PreparedItemDto[];

  static kitchenPreparationToPreparationDtoFactory(kitchenPreparation): PreparationDto {
    const preparation: PreparationDto = new PreparationDto();
    preparation._id = kitchenPreparation._id;
    preparation.shouldBeReadyAt = kitchenPreparation.shouldBeReadyAt;
    preparation.preparedItems = kitchenPreparation.preparedItems.map((preparedItem) => PreparedItemDto.kitchenPreparedItemToPreparedItemDtoFactory(preparedItem));

    return preparation;
  }
}
