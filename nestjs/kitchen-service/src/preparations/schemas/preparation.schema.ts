import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { Document } from 'mongoose';
import { ApiProperty } from '@nestjs/swagger';

import { PreparedItem } from '../../preparedItems/schemas/prepared-item.schema';

export type PreparationDocument = Preparation & Document;

@Schema({
  versionKey: false,
})
export class Preparation {
  @ApiProperty()
  _id: string;

  @ApiProperty()
  @Prop({ required: true, min: 0 })
  tableNumber: number;

  @ApiProperty()
  @Prop({ required: true, default: new Date() })
  shouldBeReadyAt: Date;

  @ApiProperty()
  @Prop({ default: null })
  completedAt: Date;

  @ApiProperty()
  @Prop({ default: null })
  takenForServiceAt: Date; // brought to the table

  @ApiProperty()
  @Prop({ required: true, type: [{ type: mongoose.Schema.Types.ObjectId, ref: 'PreparedItem' }] })
  preparedItems: PreparedItem[];
}

export const PreparationSchema = SchemaFactory.createForClass(Preparation);
