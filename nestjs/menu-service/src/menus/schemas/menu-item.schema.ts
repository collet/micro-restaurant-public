import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { ApiProperty } from '@nestjs/swagger';

import { CategoryEnum } from './category-enum.schema';

export type MenuItemDocument = MenuItem & Document;

@Schema({
  versionKey: false,
})
export class MenuItem {
  @ApiProperty()
  _id: string;

  @ApiProperty()
  @Prop({ required: true })
  fullName: string;

  @ApiProperty()
  @Prop({ required: true })
  shortName: string;

  @ApiProperty()
  @Prop({ required: true, min: 0 })
  price: number;

  @ApiProperty()
  @Prop({ required: true })
  category: CategoryEnum;

  @ApiProperty()
  @Prop({ default: null })
  image: string;
}

export const MenuItemSchema = SchemaFactory.createForClass(MenuItem);
