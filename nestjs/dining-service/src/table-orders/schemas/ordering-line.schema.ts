import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { ApiProperty } from '@nestjs/swagger';

import { OrderingItem } from './ordering-item.schema';

export type OrderingLineDocument = OrderingLine & Document;

@Schema({
  versionKey: false,
})
export class OrderingLine {
  @ApiProperty()
  _id: string;

  @ApiProperty()
  @Prop({ required: true })
  item: OrderingItem;

  @ApiProperty()
  @Prop({ required: true, min: 0 })
  howMany: number;

  @ApiProperty()
  @Prop({ default: false })
  sentForPreparation: boolean;
}

export const OrderingLineSchema = SchemaFactory.createForClass(OrderingLine);
