import { HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

import { Recipe, RecipeDocument } from '../../shared/schemas/recipe.schema';
import { Preparation, PreparationDocument } from '../../preparations/schemas/preparation.schema';
import { PostEnum } from '../../shared/schemas/post-enum.schema';

import { RecipeWithItemToBeCookedInterface } from '../../shared/interfaces/recipe-with-item-to-be-cooked.interface';

import { ItemToBeCookedDto } from '../../preparations/dto/item-to-be-cooked.dto';

import { RecipeNotFoundException } from '../exceptions/recipe-not-found.exception';
import { PreparedItem, PreparedItemDocument } from '../../preparedItems/schemas/prepared-item.schema';
import { ErrorDto } from '../../shared/dto/error.dto';

@Injectable()
export class KitchenFacadeService {
  constructor(
    @InjectModel(Recipe.name) private recipeModel: Model<RecipeDocument>,
    @InjectModel(Preparation.name) private preparationModel: Model<PreparationDocument>,
    @InjectModel(PreparedItem.name) private preparedItemModel: Model<PreparedItemDocument>,
  ) {}

  async getRecipeFromMenuItemShortName(menuItemShortName: string): Promise<Recipe> {
    const foundRecipe = await this.recipeModel.findOne({ shortName: menuItemShortName }).lean();

    if (foundRecipe === null) {
      throw new RecipeNotFoundException(menuItemShortName);
    }

    return foundRecipe;
  }

  computeMaxCookingTime(recipeWithItemToBeCookedList: RecipeWithItemToBeCookedInterface[]): number {
    return Math.max(...recipeWithItemToBeCookedList.map((recipeWithItemToBeCooked) => (recipeWithItemToBeCooked.recipe.meanCookingTimeInSec)));
  }

  async createPreparedItem(shortName: string, recipe: Recipe, shouldStartAt: Date): Promise<PreparedItem> {
    const newPreparedItem: PreparedItem = new PreparedItem();
    newPreparedItem.shortName = shortName;
    newPreparedItem.recipe = recipe;
    newPreparedItem.shouldStartAt = shouldStartAt;

    return await this.preparedItemModel.create(newPreparedItem);
  }

  async startCookingProcess(recipeWithItemToBeCookedList: RecipeWithItemToBeCookedInterface[], maxPreparationTime: number): Promise<PreparedItem[]> {
    const now: Date = new Date();
    const expectedDeliveryTime: Date = new Date(now.getTime() + maxPreparationTime * 1000);

    const createPreparedItemCalls = [];
    recipeWithItemToBeCookedList.forEach((recipeWithItemToBeCooked) => {
      for (let i = 0; i < recipeWithItemToBeCooked.itemToBeCooked.howMany; i += 1) {
        createPreparedItemCalls.push(
          this.createPreparedItem(
            recipeWithItemToBeCooked.itemToBeCooked.menuItemShortName,
            recipeWithItemToBeCooked.recipe,
            new Date(expectedDeliveryTime.getTime() - recipeWithItemToBeCooked.recipe.meanCookingTimeInSec * 1000), // start time is set to finish at expectedDeliveryTime
          ),
        );
      }
    });

    return await Promise.all(createPreparedItemCalls);
  }

  async createPreparation(tableNumber: number, preparedItems: PreparedItem[], shouldBeReadyAt: Date): Promise<Preparation> {
    const newPreparation: Preparation = new Preparation();
    newPreparation.tableNumber = tableNumber;
    newPreparation.preparedItems = preparedItems;
    newPreparation.shouldBeReadyAt = shouldBeReadyAt;

    return await this.preparationModel.create(newPreparation);
  }

  async receivePreparation(tableNumber: number, itemsToBeCooked: ItemToBeCookedDto[]): Promise<Preparation[]> {
    const recipesCalls = itemsToBeCooked.map((itemToBeCooked) => (
      this.getRecipeFromMenuItemShortName(itemToBeCooked.menuItemShortName)
    ));

    const recipes: Recipe[] = await Promise.all(recipesCalls);

    const byPost = recipes.reduce((res, recipe, index) => {
      const postList = res[recipe.post] || [];
      postList.push({
        recipe,
        itemToBeCooked: itemsToBeCooked[index],
      });
      res[recipe.post] = postList;

      return res;
    }, {});

    const newPreparations: Preparation[] = [];
    const now: Date = new Date();

    if (byPost[PostEnum.BAR]?.length > 0) {
      const maxTime = this.computeMaxCookingTime(byPost[PostEnum.BAR]);
      const preparedItems: PreparedItem[] = await this.startCookingProcess(byPost[PostEnum.BAR], maxTime);
      const preparation: Preparation = await this.createPreparation(tableNumber, preparedItems, new Date(now.getTime() + maxTime * 1000));
      newPreparations.push(preparation);
    }

    const coldDishList = byPost[PostEnum.COLD_DISH] || [];
    const hotDishList = byPost[PostEnum.HOT_DISH] || [];
    if ((coldDishList.length + hotDishList.length) > 0) {
      const maxTime = this.computeMaxCookingTime([].concat(coldDishList, hotDishList));

      if (coldDishList.length > 0) {
        const preparedItems: PreparedItem[] = await this.startCookingProcess(coldDishList, maxTime);
        const preparation: Preparation = await this.createPreparation(tableNumber, preparedItems, new Date(now.getTime() + maxTime * 1000));
        newPreparations.push(preparation);
      }

      if (hotDishList.length > 0) {
        const preparedItems: PreparedItem[] = await this.startCookingProcess(hotDishList, maxTime);
        const preparation: Preparation = await this.createPreparation(tableNumber, preparedItems, new Date(now.getTime() + maxTime * 1000));
        newPreparations.push(preparation);
      }
    }

    return newPreparations;
  }

  async checkAndUpdatePreparation(preparedItem: PreparedItem) {
    const preparationsFromPreparedItem: Preparation[] = await this.preparationModel.find({ 'completedAt': { $eq: null }, 'preparedItems': preparedItem._id }).populate({
      path: 'preparedItems',
      populate: { path: 'recipe' }
    }).exec();

    if (preparationsFromPreparedItem.length === 0 || preparationsFromPreparedItem.length > 1) {
      throw new ErrorDto(HttpStatus.INTERNAL_SERVER_ERROR, `The Prepared Item with Id ${preparedItem._id} should be linked to at least and only one Preparation.`);
    }

    const preparation: Preparation = preparationsFromPreparedItem[0];

    if (preparation.preparedItems.every((preparationPreparedItem) => (preparationPreparedItem.finishedAt !== null))) {
      preparation.completedAt = new Date(preparedItem.finishedAt);
      await this.preparationModel.findByIdAndUpdate(preparation._id, preparation, { returnDocument: 'after' }).populate({
        path: 'preparedItems',
        populate: { path: 'recipe' }
      });
    }
  }
}
