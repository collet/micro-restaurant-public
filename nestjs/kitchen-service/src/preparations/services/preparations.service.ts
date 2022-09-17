import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

import { Recipe, RecipeDocument } from '../../shared/schemas/recipe.schema';
import { Preparation, PreparationDocument } from '../schemas/preparation.schema';
import { PreparationStateEnum } from '../schemas/preparation-state-enum.schema';

import { PreparationRequestDto } from '../dto/preparation-request.dto';

import { DiningProxyService } from './dining-proxy.service';

import { WrongQueryParameterException } from '../exceptions/wrong-query-parameter.exception';
import { TableNumberNotFoundException } from '../exceptions/table-number-not-found.exception';
import { EmptyItemsToBeCookedSentInKitchenException } from '../exceptions/empty-items-to-be-cooked-sent-in-kitchen.exception';
import { ItemsToBeCookedNotFoundException } from '../exceptions/items-to-be-cooked-not-found.exception';

@Injectable()
export class PreparationsService {
  constructor(
    @InjectModel(Recipe.name) private recipeModel: Model<RecipeDocument>,
    @InjectModel(Preparation.name) private preparationModel: Model<PreparationDocument>,
    private readonly diningProxyService: DiningProxyService,
  ){}

  async findByStateAndTableNumber(preparationState: PreparationStateEnum, tableNumber: number = null): Promise<Preparation[]> {
    if (tableNumber !== null) {
      const tableIsValid: Boolean = await this.diningProxyService.isTableNumberValid(tableNumber);

      if (!tableIsValid) {
        throw new TableNumberNotFoundException(tableNumber);
      }
    }

    switch (preparationState) {
      case PreparationStateEnum.READY_TO_BE_SERVED: {
        let mongoFilter: object = {
          'completedAt': { $ne: null },
          'takenForServiceAt': { $eq: null },
        };
        if (tableNumber !== null) {
          mongoFilter = {
            ...mongoFilter,
            'tableNumber': { $eq: tableNumber },
          };
        }

        return this.preparationModel.find(mongoFilter).lean();
      }

      case PreparationStateEnum.PREPARATION_STARTED: {
        let mongoFilter: object = {
          'completedAt': { $eq: null },
        };
        if (tableNumber !== null) {
          mongoFilter = {
            ...mongoFilter,
            'tableNumber': { $eq: tableNumber },
          };
        }

        return this.preparationModel.find(mongoFilter).lean();
      }

      default:
        throw new WrongQueryParameterException(preparationState);
    }
  }

  async cookItems(preparationRequestDto: PreparationRequestDto): Promise<Preparation[]> {
    const tableIsValid: Boolean = await this.diningProxyService.isTableNumberValid(preparationRequestDto.tableNumber);

    if (!tableIsValid) {
      throw new TableNumberNotFoundException(preparationRequestDto.tableNumber);
    }

    if (preparationRequestDto.itemsToBeCooked.length === 0) {
      throw new EmptyItemsToBeCookedSentInKitchenException(preparationRequestDto.tableNumber);
    }

    const foundRecipesRequests = [];
    preparationRequestDto.itemsToBeCooked.forEach((itemToBeCooked) => {
      foundRecipesRequests.push(
        this.recipeModel.findOne({ shortName: itemToBeCooked.menuItemShortName }).lean()
      );
    });
    const foundRecipes: Recipe[] = await Promise.all(foundRecipesRequests);
    const unknownShortNames = foundRecipes.reduce((shortNames, foundRecipe, index) => {
      if (foundRecipe === null) {
        shortNames.push(preparationRequestDto.itemsToBeCooked[index].menuItemShortName);
      }

      return shortNames;
    }, []);
    if (unknownShortNames.length > 0) {
      throw new ItemsToBeCookedNotFoundException(unknownShortNames);
    }

    // TODO: KitchenService (shared) => kitchenService.receivePreparation(preparationRequestDto.tableNumber, preparationRequestDto.itemsToBeCooked)
  }

  /*
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
  */
}
