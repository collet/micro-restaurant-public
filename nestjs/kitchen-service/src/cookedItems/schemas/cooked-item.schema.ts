import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { Document } from 'mongoose';
import { ApiProperty } from '@nestjs/swagger';

import { Recipe } from './recipe.schema';

export type CookedItemDocument = CookedItem & Document;

@Schema({
  versionKey: false,
})
export class CookedItem {
  @ApiProperty()
  _id: string;

  @ApiProperty()
  @Prop({ required: true, type: mongoose.Schema.Types.ObjectId, ref: 'Recipe' })
  cookableRecipe: Recipe;

  @ApiProperty()
  @Prop({ required: true, default: new Date() })
  preparationStarted: Date;

  @ApiProperty()
  @Prop({ required: true, default: new Date() })
  readyToServe: Date;

  @ApiProperty()
  @Prop({ default: null })
  takenForService: Date;
}

export const CookedItemSchema = SchemaFactory.createForClass(CookedItem);
