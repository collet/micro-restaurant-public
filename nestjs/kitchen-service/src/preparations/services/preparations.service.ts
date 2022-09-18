import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

import { Recipe, RecipeDocument } from '../../shared/schemas/recipe.schema';
import { Preparation, PreparationDocument } from '../schemas/preparation.schema';
import { PreparationStateEnum } from '../schemas/preparation-state-enum.schema';

import { PreparationRequestDto } from '../dto/preparation-request.dto';

import { DiningProxyService } from './dining-proxy.service';
import { KitchenFacadeService } from '../../kitchenFacade/services/kitchen-facade.service';

import { WrongQueryParameterException } from '../exceptions/wrong-query-parameter.exception';
import { TableNumberNotFoundException } from '../exceptions/table-number-not-found.exception';
import { EmptyItemsToBeCookedSentInKitchenException } from '../exceptions/empty-items-to-be-cooked-sent-in-kitchen.exception';
import { ItemsToBeCookedNotFoundException } from '../exceptions/items-to-be-cooked-not-found.exception';
import { PreparationIdNotFoundException } from '../exceptions/preparation-id-not-found.exception';
import { PreparationNotReadyInKitchenException } from '../exceptions/preparation-not-ready-in-kitchen.exception';
import { PreparationAlreadyTakenFromKitchenException } from '../exceptions/preparation-already-taken-from-kitchen.exception';

@Injectable()
export class PreparationsService {
  constructor(
    @InjectModel(Recipe.name) private recipeModel: Model<RecipeDocument>,
    @InjectModel(Preparation.name) private preparationModel: Model<PreparationDocument>,
    private readonly diningProxyService: DiningProxyService,
    private readonly kitchenFacadeService: KitchenFacadeService,
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

        return this.preparationModel.find(mongoFilter).populate({
          path: 'preparedItems',
          populate: { path: 'recipe' }
        }).lean();
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

        return this.preparationModel.find(mongoFilter).populate({
          path: 'preparedItems',
          populate: { path: 'recipe' }
        }).lean();
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

    return await this.kitchenFacadeService.receivePreparation(preparationRequestDto.tableNumber, preparationRequestDto.itemsToBeCooked);
  }

  async findPreparationById(preparationId: string): Promise<Preparation> {
    const foundPreparation = await this.preparationModel.findOne({ _id: preparationId }).populate({
      path: 'preparedItems',
      populate: { path: 'recipe' }
    }).lean();

    if (foundPreparation === null) {
      throw new PreparationIdNotFoundException(preparationId);
    }

    return foundPreparation;
  }

  async isTakenForService(preparationId: string): Promise<Preparation> {
    const preparation: Preparation = await this.findPreparationById(preparationId);
    if (preparation.completedAt === null) {
      throw new PreparationNotReadyInKitchenException(preparation);
    }

    if (preparation.takenForServiceAt !== null) {
      throw new PreparationAlreadyTakenFromKitchenException(preparation);
    }

    preparation.takenForServiceAt = new Date();

    return this.preparationModel.findByIdAndUpdate(preparation._id, preparation, { returnDocument: 'after' }).populate({
      path: 'preparedItems',
      populate: { path: 'recipe' }
    });
  }
}
