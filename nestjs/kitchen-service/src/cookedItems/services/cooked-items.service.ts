import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

import { Recipe, RecipeDocument } from '../schemas/recipe.schema';
import { CookedItem, CookedItemDocument } from '../schemas/cooked-item.schema';
import { CookStateEnum } from '../schemas/cook-state-enum.schema';

import { ItemToBeCookedDto } from '../dto/item-to-be-cooked.dto';

import { ItemToBeCookedNotFoundException } from '../exceptions/item-to-be-cooked-not-found.exception';
import { WrongQueryParameterException } from '../exceptions/wrong-query-parameter.exception';
import { CookedItemIdNotFoundException } from '../exceptions/cooked-item-id-not-found.exception';
import { CookedItemAlreadyTakenFromKitchenException } from '../exceptions/cooked-item-already-taken-from-kitchen.exception';
import { CookedItemNotReadyInKitchenYetException } from '../exceptions/cooked-item-not-ready-in-kitchen-yet.exception';

@Injectable()
export class CookedItemsService {
  constructor(@InjectModel(Recipe.name) private recipeModel: Model<RecipeDocument>, @InjectModel(CookedItem.name) private cookedItemModel: Model<CookedItemDocument>) {}

  async findOne(cookedItemId: string): Promise<CookedItem> {
    const foundItem = await this.cookedItemModel.findOne({ _id: cookedItemId }).lean();

    if (foundItem === null) {
      throw new CookedItemIdNotFoundException(cookedItemId);
    }

    return foundItem;
  }

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

  async findByCookState(cookState: CookStateEnum): Promise<CookedItem[]> {
    const now: Date = new Date();

    switch (cookState) {
      case CookStateEnum.READY_TO_BE_SERVED: {
        return this.cookedItemModel.find({ 'takenForService': { $eq: null }, 'readyToServe': { $lt: now.toISOString() } }).lean();
      }

      case CookStateEnum.PREPARATION_STARTED: {
        return this.cookedItemModel.find({ 'takenForService': { $eq: null }, 'readyToServe': { $gte: now.toISOString() } }).lean();
      }

      default:
        throw new WrongQueryParameterException(cookState);
    }
  }

  async isTakenForService(cookedItemId: string): Promise<CookedItem> {
    const cookedItem: CookedItem = await this.findOne(cookedItemId);

    if (cookedItem.takenForService !== null) {
      throw new CookedItemAlreadyTakenFromKitchenException(cookedItem);
    }

    const now = new Date();
    const readyToServeDate = new Date(cookedItem.readyToServe);
    if (readyToServeDate > now) {
      throw new CookedItemNotReadyInKitchenYetException(cookedItem);
    }

    cookedItem.takenForService = new Date();

    return this.cookedItemModel.findByIdAndUpdate(cookedItem._id, cookedItem, { returnDocument: 'after' });
  }
}
