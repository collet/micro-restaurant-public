import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { ApiProperty } from '@nestjs/swagger';

export type OrderingItemDocument = OrderingItem & Document;

@Schema({
  versionKey: false,
})
export class OrderingItem {
  @ApiProperty()
  _id: string;

  @ApiProperty()
  @Prop({ required: true })
  menuItemId: string; // id of the item from the menu

  @ApiProperty()
  @Prop({ required: true })
  shortName: string;
}

export const OrderingItemSchema = SchemaFactory.createForClass(OrderingItem);
