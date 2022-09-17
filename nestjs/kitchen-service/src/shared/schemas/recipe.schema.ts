import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { ApiProperty } from '@nestjs/swagger';

import { PostEnum } from './post-enum.schema';

export type RecipeDocument = Recipe & Document;

@Schema({
  versionKey: false,
})
export class Recipe {
  @ApiProperty()
  _id: string;

  @ApiProperty()
  @Prop({ required: true })
  shortName: string;

  @ApiProperty()
  @Prop({ required: true })
  post: PostEnum;

  @ApiProperty()
  @Prop({ required: true })
  cookingSteps: string[];

  @ApiProperty()
  @Prop({ required: true, min: 0 })
  meanCookingTimeInSec: number;
}

export const RecipeSchema = SchemaFactory.createForClass(Recipe);
