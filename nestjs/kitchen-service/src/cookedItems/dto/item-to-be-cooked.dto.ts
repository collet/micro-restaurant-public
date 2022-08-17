import { IsNotEmpty, IsPositive } from 'class-validator';

export class ItemToBeCookedDto {
  @IsNotEmpty()
  menuItemShortName: string;

  @IsNotEmpty()
  @IsPositive()
  howMany: number;
}
