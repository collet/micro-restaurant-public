import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { Recipe, RecipeSchema } from '../shared/schemas/recipe.schema';
import { Preparation, PreparationSchema } from './schemas/preparation.schema';

import { PreparationsController } from './controllers/preparations.controller';
import { PreparationsService } from './services/preparations.service';

@Module({
  imports: [MongooseModule.forFeature([
    { name: Recipe.name, schema: RecipeSchema },
    { name: Preparation.name, schema: PreparationSchema },
  ])],
  controllers: [PreparationsController],
  providers: [PreparationsService],
})
export class PreparationsModule {}
