import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { KitchenFacadeService } from './services/kitchen-facade.service';

import { Recipe, RecipeSchema } from '../shared/schemas/recipe.schema';
import { Preparation, PreparationSchema } from '../preparations/schemas/preparation.schema';
import { PreparedItem, PreparedItemSchema } from '../preparedItems/schemas/prepared-item.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Recipe.name, schema: RecipeSchema },
      { name: Preparation.name, schema: PreparationSchema },
      { name: PreparedItem.name, schema: PreparedItemSchema },
    ]),
  ],
  providers: [
    KitchenFacadeService,
  ],
  exports: [KitchenFacadeService],
})
export class KitchenFacadeModule {}
