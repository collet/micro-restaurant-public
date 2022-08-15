import { Prop } from '@nestjs/mongoose';
import { ApiProperty } from '@nestjs/swagger';

export class OrderingItem {
  @ApiProperty()
  @Prop({ required: true })
  menuItemId: string; // id of the item from the menu

  @ApiProperty()
  @Prop({ required: true })
  shortName: string;
}
