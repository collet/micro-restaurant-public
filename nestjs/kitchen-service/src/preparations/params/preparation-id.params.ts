import { IsMongoId } from 'class-validator';

export class PreparationIdParams {
  @IsMongoId()
  preparationId: string;
}
