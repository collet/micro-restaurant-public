import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

import { Recipe, RecipeDocument } from '../schemas/recipe.schema';
import { CookedItem, CookedItemDocument } from '../schemas/cooked-item.schema';

import { ItemToBeCookedDto } from '../dto/item-to-be-cooked.dto';

import { ItemToBeCookedNotFoundException } from '../exceptions/item-to-be-cooked-not-found.exception';

@Injectable()
export class CookedItemsService {
  constructor(@InjectModel(Recipe.name) private recipeModel: Model<RecipeDocument>, @InjectModel(CookedItem.name) private cookedItemModel: Model<CookedItemDocument>) {}

  async cookItems(itemToBeCookedDto: ItemToBeCookedDto): Promise<CookedItem[]> {
    const foundRecipe: Recipe = await this.recipeModel.findOne({ shortName: itemToBeCookedDto.menuItemShortName }).lean();

    if (foundRecipe === null) {
      throw new ItemToBeCookedNotFoundException(itemToBeCookedDto.menuItemShortName);
    }

    const cookedItemList: CookedItem[] = [];

    for(let i = 0; i < itemToBeCookedDto.howMany; i += 1) {
      const cookedItemToCreate = new CookedItem();
      cookedItemToCreate.cookableRecipe = foundRecipe;
      cookedItemToCreate.preparationStarted = new Date();
      cookedItemToCreate.readyToServe = new Date(cookedItemToCreate.preparationStarted.getTime() + foundRecipe.meanCookingTimeInSec * 1000);

      const cookedItem: CookedItem = await this.cookedItemModel.create(cookedItemToCreate);

      cookedItemList.push(cookedItem);
    }

    return cookedItemList;
  }
}
