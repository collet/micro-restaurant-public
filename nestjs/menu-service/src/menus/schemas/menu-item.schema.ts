import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type MenuItemDocument = MenuItem & Document;

@Schema()
export class MenuItem {
  @Prop({ required: true })
  fullName: string;

  @Prop({ required: true })
  shortName: string;

  @Prop({ required: true, min: 0 })
  price: number;
}

export const MenuItemSchema = SchemaFactory.createForClass(MenuItem);
