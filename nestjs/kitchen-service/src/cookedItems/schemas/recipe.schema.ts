import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { ApiProperty } from '@nestjs/swagger';

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
  cookingSteps: string[];

  @ApiProperty()
  @Prop({ required: true, min: 0 })
  meanCookingTimeInSec: number;

  // @ApiProperty()
  // category: string; // category is a String here to show that type (or full tech stack) could be different
  // for menu and kitchen services
}

export const RecipeSchema = SchemaFactory.createForClass(Recipe);
