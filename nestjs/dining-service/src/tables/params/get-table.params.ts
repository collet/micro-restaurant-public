import { IsNumberString } from 'class-validator';

export class GetTableParams {
  @IsNumberString()
  tableNumber: number;
}
