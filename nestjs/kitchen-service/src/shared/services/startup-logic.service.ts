import { OnApplicationBootstrap } from '@nestjs/common';
import { InjectConnection } from '@nestjs/mongoose';
import { Connection } from 'mongoose';

import { Recipe } from '../schemas/recipe.schema';
import { PostEnum } from '../schemas/post-enum.schema';

export class StartupLogicService implements OnApplicationBootstrap {
  constructor(@InjectConnection() private connection: Connection) {}

  createRecipe(shortName: string, post: PostEnum, cookingSteps: string[], meanCookingTimeInSec: number): Recipe {
    const recipe: Recipe = new Recipe();
    recipe.shortName = shortName;
    recipe.post = post;
    recipe.cookingSteps = cookingSteps;
    recipe.meanCookingTimeInSec = meanCookingTimeInSec;
    return recipe;
  }

  async addRecipe(shortName: string, post: PostEnum, cookingSteps: string[], meanCookingTimeInSec: number) {
    const recipeModel = this.connection.models['Recipe'];

    const alreadyExists = await recipeModel.find({ shortName });
    if (alreadyExists.length > 0) {
      throw new Error('Recipe already exists.');
    }

    return recipeModel.create(this.createRecipe(shortName, post, cookingSteps, meanCookingTimeInSec));
  }

  async onApplicationBootstrap() {
    /* Starters */
    try {
      await this.addRecipe('foie gras', PostEnum.HOT_DISH, ['Take piece of foie gras', 'Cook it!'], 18);
    } catch (e) {
    }
    try {
      await this.addRecipe('soft-boiled egg', PostEnum.HOT_DISH,['Take egg', 'Cook it!'], 16);
    } catch (e) {
    }
    try {
      await this.addRecipe('goat cheese', PostEnum.COLD_DISH,['Take goat cheese', 'Cook it!'], 15);
    } catch (e) {
    }
    try {
      await this.addRecipe('salmon', PostEnum.HOT_DISH, ['Take salmon', 'Cook it!'], 16);
    } catch (e) {
    }
    try {
      await this.addRecipe('crab maki', PostEnum.HOT_DISH, ['Take crab', 'Cook it!', 'Make maki'], 16);
    } catch (e) {
    }
    try {
      await this.addRecipe('burrata', PostEnum.COLD_DISH, ['Take burrata', 'Take mozzarella', 'Put them togther', 'Shake', 'Ok it\'s finished!'], 16);
    } catch (e) {
    }

    /* Main */
    try {
      await this.addRecipe('pizza', PostEnum.HOT_DISH, ['Stretch pizza dough', 'Put toppings on it', 'Bake at 350 Celsius degree'], 10);
    } catch (e) {
    }
    try {
      await this.addRecipe('lasagna', PostEnum.HOT_DISH, ['Get the frozen dish', 'Oven it at 220 Celsius degree'], 8);
    } catch (e) {
    }
    try {
      await this.addRecipe('beef burger', PostEnum.HOT_DISH, ['Take piece of beef', 'Cook it!', 'Make the burger', 'Don\'t forget fries!!'], 19);
    } catch (e) {
    }
    try {
      await this.addRecipe('beef chuck', PostEnum.HOT_DISH, ['Take piece of beef chuck', 'Cook it!', 'Don\'t forget fries!!'], 24);
    } catch (e) {
    }
    try {
      await this.addRecipe('half cooked tuna', PostEnum.HOT_DISH, ['Take tuna', 'Half-cook it!'], 23);
    } catch (e) {
    }

    /* Desserts */
    try {
      await this.addRecipe('brownie', PostEnum.COLD_DISH, ['Take a piece of brownie', 'Oven it quickly', 'Put it in a plate', 'Add some vanilla ice', 'Add some cream'], 6);
    } catch (e) {
    }
    try {
      await this.addRecipe('chocolate', PostEnum.COLD_DISH, ['Put some chocolate ice cream in a plate'], 12);
    } catch (e) {
    }
    try {
      await this.addRecipe('lemon', PostEnum.COLD_DISH, ['Take lemon cream', 'Take limoncello sorbet', 'Put all ina plate'], 12);
    } catch (e) {
    }
    try {
      await this.addRecipe('rasp and peaches', PostEnum.COLD_DISH, ['Take raspberries', 'Take peaches', 'That\'s it'], 12);
    } catch (e) {
    }
    try {
      await this.addRecipe('strawberries', PostEnum.COLD_DISH, ['Put some strawberries in a plate', 'Add vanilla mascarpone mousse'], 12);
    } catch (e) {
    }
    try {
      await this.addRecipe('seasonal fruit', PostEnum.COLD_DISH, ['Put some seasonal fruit in a bowl'], 12);
    } catch (e) {
    }
    try {
      await this.addRecipe('tiramisu', PostEnum.COLD_DISH, ['Take a prepared tiramisu'], 10);
    } catch (e) {
    }

    /* Beverage */
    try {
      await this.addRecipe('coke', PostEnum.BAR, ['Serve it!'], 2);
    } catch (e) {
    }
    try {
      await this.addRecipe('ice tea', PostEnum.BAR, ['Serve it!'], 2);
    } catch (e) {
    }
    try {
      await this.addRecipe('bottled water', PostEnum.BAR, ['Serve it!'], 2);
    } catch (e) {
    }
    try {
      await this.addRecipe('sparkling water', PostEnum.BAR, ['Serve it!'], 2);
    } catch (e) {
    }
    try {
      await this.addRecipe('spritz', PostEnum.BAR, ['Prosecco: 3 cl', 'Aperol: 2 cl', 'A bit of Schweppes Tonic Original', 'Shake it!',  'Serve it!'], 20);
    } catch (e) {
    }
    try {
      await this.addRecipe('margarita', PostEnum.BAR, ['Serve it!'], 2);
    } catch (e) {
    }
    try {
      await this.addRecipe('tequila', PostEnum.BAR, ['Serve it!'], 2);
    } catch (e) {
    }
    try {
      await this.addRecipe('mojito', PostEnum.BAR, ['Put crushed ice in a glass', 'Put some mint leaves', 'Cut lemon and put it in the glass', 'Add some cane sugar syrup', 'Crush the lemon', 'Add some crushed ice', 'Add the rhum', 'Add the sparkling water', 'Mix it up!', 'Serve it!'], 30);
    } catch (e) {
    }
    try {
      await this.addRecipe('martini', PostEnum.BAR, ['Serve it!'], 2);
    } catch (e) {
    }
    try {
      await this.addRecipe('lemonade', PostEnum.BAR, ['Serve it!'], 2);
    } catch (e) {
    }
    try {
      await this.addRecipe('apple juice', PostEnum.BAR, ['Serve it!'], 2);
    } catch (e) {
    }
    try {
      await this.addRecipe('café', PostEnum.BAR, ['Serve it!'], 2);
    } catch (e) {
    }
  }
}
