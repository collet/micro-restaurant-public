import { IsNotEmpty, IsPositive } from 'class-validator';

export class StartOrderingDto {
  @IsNotEmpty()
  @IsPositive()
  tableNumber: number;

  @IsNotEmpty()
  @IsPositive()
  customersCount: number;
}
