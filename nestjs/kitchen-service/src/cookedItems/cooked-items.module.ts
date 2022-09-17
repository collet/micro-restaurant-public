import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { Recipe, RecipeSchema } from '../shared/schemas/recipe.schema';
import { CookedItem, CookedItemSchema } from './schemas/cooked-item.schema';

import { CookedItemsController } from './controllers/cooked-items.controller';
import { CookedItemsService } from './services/cooked-items.service';

@Module({
  imports: [MongooseModule.forFeature([
    { name: Recipe.name, schema: RecipeSchema },
    { name: CookedItem.name, schema: CookedItemSchema },
  ])],
  controllers: [CookedItemsController],
  providers: [CookedItemsService],
})
export class CookedItemsModule {}
