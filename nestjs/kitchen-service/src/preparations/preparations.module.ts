import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { HttpModule } from '@nestjs/axios';

import { Recipe, RecipeSchema } from '../shared/schemas/recipe.schema';
import { Preparation, PreparationSchema } from './schemas/preparation.schema';

import { PreparationsController } from './controllers/preparations.controller';
import { PreparationsService } from './services/preparations.service';
import { DiningProxyService } from './services/dining-proxy.service';

import { KitchenFacadeModule } from '../kitchenFacade/kitchen-facade.module';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Recipe.name, schema: RecipeSchema },
      { name: Preparation.name, schema: PreparationSchema },
    ]),
    HttpModule,
    KitchenFacadeModule,
  ],
  controllers: [PreparationsController],
  providers: [
    PreparationsService,
    DiningProxyService,
  ],
})
export class PreparationsModule {}
