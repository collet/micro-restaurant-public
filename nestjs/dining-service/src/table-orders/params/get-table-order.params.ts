import { IsMongoId } from 'class-validator';

export class GetTableOrderParams {
  @IsMongoId()
  tableOrderId: string;
}
