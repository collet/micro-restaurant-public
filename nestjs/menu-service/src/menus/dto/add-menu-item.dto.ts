import { IsEnum, IsNotEmpty, IsOptional, IsPositive, IsString, IsUrl } from 'class-validator';

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

  @IsOptional()
  @IsUrl({ require_protocol: true, require_valid_protocol: true, protocols: ['http', 'https']})
  image: string;
}
