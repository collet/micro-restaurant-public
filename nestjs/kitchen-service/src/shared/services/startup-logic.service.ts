import { OnApplicationBootstrap } from '@nestjs/common';
import { InjectConnection } from '@nestjs/mongoose';
import { Connection } from 'mongoose';

import { Recipe } from '../../cookedItems/schemas/recipe.schema';

export class StartupLogicService implements OnApplicationBootstrap {
  constructor(@InjectConnection() private connection: Connection) {}

  createRecipe(shortName: string, cookingSteps: string[], meanCookingTimeInSec: number): Recipe {
    const recipe: Recipe = new Recipe();
    recipe.shortName = shortName;
    recipe.cookingSteps = cookingSteps;
    recipe.meanCookingTimeInSec = meanCookingTimeInSec;
    return recipe;
  }

  async addRecipe(shortName: string, cookingSteps: string[], meanCookingTimeInSec: number) {
    const recipeModel = this.connection.models['Recipe'];

    const alreadyExists = await recipeModel.find({ shortName });
    if (alreadyExists.length > 0) {
      throw new Error('Recipe already exists.');
    }

    return recipeModel.create(this.createRecipe(shortName, cookingSteps, meanCookingTimeInSec));
  }

  async onApplicationBootstrap() {
    try {
      await this.addRecipe('pizza', ['Stretch pizza dough', 'Put toppings on it', 'Bake at 350 Celsius degree'], 10);
      await this.addRecipe('lasagna', ['Get the frozen dish', 'Oven it at 220 Celsius degree'], 8);
      await this.addRecipe('coke', ['Serve it!'], 2);
    } catch (e) {
    }
  }
}
