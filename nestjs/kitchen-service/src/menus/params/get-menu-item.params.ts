import { IsMongoId } from 'class-validator';

export class GetMenuItemParams {
  @IsMongoId()
  menuItemId: string;
}
