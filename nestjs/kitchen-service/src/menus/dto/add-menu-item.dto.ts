import { IsNotEmpty, IsPositive, IsString } from 'class-validator';

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
}
