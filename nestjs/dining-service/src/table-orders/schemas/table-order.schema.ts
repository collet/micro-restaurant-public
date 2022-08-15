import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { ApiProperty } from '@nestjs/swagger';

import { OrderingLine } from './ordering-line.schema';

export type TableOrderDocument = TableOrder & Document;

@Schema({
  versionKey: false,
})
export class TableOrder {
  @ApiProperty()
  _id: string;

  @ApiProperty()
  @Prop({ required: true, min: 0 })
  tableNumber: number;

  @ApiProperty()
  @Prop({ required: true, min: 0 })
  customersCount: number;

  @ApiProperty()
  @Prop({ required: true, default: new Date() })
  opened: Date;

  @ApiProperty()
  @Prop({ default: [] })
  lines: OrderingLine[];

  @ApiProperty()
  @Prop({ default: null })
  billed: Date;
}

export const TableOrderSchema = SchemaFactory.createForClass(TableOrder);
