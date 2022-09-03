import { IsEnum, IsNotEmpty, IsPositive, IsString } from 'class-validator';

import { CategoryEnum } from '../schemas/category-enum.schema';

export class AddMenuItemDto {
  @IsNotEmpty()
  @IsString()
  fullName: string;

  @IsNotEmpty()
  @IsString()
  shortName: string;

  @IsNotEmpty()
  @IsPositive()
  price: number;

  @IsNotEmpty()
  @IsEnum(CategoryEnum)
  category: CategoryEnum;
}
