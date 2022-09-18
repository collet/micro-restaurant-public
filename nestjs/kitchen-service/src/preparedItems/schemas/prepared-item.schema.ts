import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { Document } from 'mongoose';
import { ApiProperty } from '@nestjs/swagger';

import { Recipe } from '../../shared/schemas/recipe.schema';

export type PreparedItemDocument = PreparedItem & Document;

@Schema({
  versionKey: false,
})
export class PreparedItem {
  @ApiProperty()
  _id: string;

  @ApiProperty()
  @Prop({ required: true })
  shortName: string;

  @ApiProperty()
  @Prop({ required: true, type: mongoose.Schema.Types.ObjectId, ref: 'Recipe' })
  recipe: Recipe;

  @ApiProperty()
  @Prop({ required: true, default: new Date() })
  shouldStartAt: Date;

  @ApiProperty()
  @Prop({ default: null })
  startedAt: Date;

  @ApiProperty()
  @Prop({ default: null })
  finishedAt: Date;
}

export const PreparedItemSchema = SchemaFactory.createForClass(PreparedItem);
