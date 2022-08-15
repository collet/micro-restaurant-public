import { IsNotEmpty, IsPositive } from 'class-validator';

export class AddTableDto {
  @IsNotEmpty()
  @IsPositive()
  number: number;
}
