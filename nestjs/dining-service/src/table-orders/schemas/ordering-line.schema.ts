import { Prop } from '@nestjs/mongoose';
import { ApiProperty } from '@nestjs/swagger';

import { OrderingItem } from './ordering-item.schema';

export class OrderingLine {
  @ApiProperty()
  @Prop({ required: true })
  item: OrderingItem;

  @ApiProperty()
  @Prop({ required: true, min: 0 })
  howMany: number;

  @ApiProperty()
  @Prop({ default: false })
  sentForPreparation: boolean;

  constructor() {
    this.item = null;
    this.howMany = 0;
    this.sentForPreparation = false;
  }
}
