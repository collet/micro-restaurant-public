import { IsMongoId } from 'class-validator';

export class PreparedItemIdParams {
  @IsMongoId()
  preparedItemId: string;
}
