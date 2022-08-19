import { IsMongoId } from 'class-validator';

export class CookedItemIdParams {
  @IsMongoId()
  cookedItemId: string;
}
