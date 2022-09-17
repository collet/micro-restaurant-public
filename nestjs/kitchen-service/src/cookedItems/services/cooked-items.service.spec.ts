import { Test, TestingModule } from '@nestjs/testing';
import { getModelToken } from '@nestjs/mongoose';
import { Model } from 'mongoose';

import { CookedItemsService } from './cooked-items.service';

import { Recipe } from '../../shared/schemas/recipe.schema';
import { CookStateEnum } from '../schemas/cook-state-enum.schema';
import { CookedItem } from '../schemas/cooked-item.schema';

import { ItemToBeCookedDto } from '../dto/item-to-be-cooked.dto';

import { CookStateQueryParams } from '../params/cook-state.query-params';
import { CookedItemIdParams } from '../params/cooked-item-id.params';

import { CookedItemIdNotFoundException } from '../exceptions/cooked-item-id-not-found.exception';
import { ItemToBeCookedNotFoundException } from '../exceptions/item-to-be-cooked-not-found.exception';
import { WrongQueryParameterException } from '../exceptions/wrong-query-parameter.exception';
import { CookedItemAlreadyTakenFromKitchenException } from '../exceptions/cooked-item-already-taken-from-kitchen.exception';
import { CookedItemNotReadyInKitchenYetException } from '../exceptions/cooked-item-not-ready-in-kitchen-yet.exception';

describe('CookedItemsService', () => {
  let service: CookedItemsService;
  let model: Model<CookedItem>;
  let recipeModel: Model<Recipe>;

  let now: Date;

  let mockRecipeList: Recipe[];
  let mockCookedItemsList: Function;
  let transformCookedItem: Function;
  let transformCookedItems: Function;
  let mockItemToBeCookedDto: ItemToBeCookedDto;
  let mockCookStateQueryParams: CookStateQueryParams;
  let mockCookedItemIdParams: CookedItemIdParams;

  beforeEach(async () => {
    now = new Date();

    mockRecipeList = [
      {
        _id: 'recipe id 1',
        shortName: 'recipe shortname 1',
        cookingSteps: ['recipe 1 step 1'],
        meanCookingTimeInSec: 11,
      },
      {
        _id: 'recipe id 2',
        shortName: 'recipe shortname 2',
        cookingSteps: ['recipe 2 step 1', 'recipe 2 step 2'],
        meanCookingTimeInSec: 222,
      },
      {
        _id: 'recipe id 3',
        shortName: 'recipe shortname 3',
        cookingSteps: ['recipe 3 step 1', 'recipe 3 step 2', 'recipe 3 step 3'],
        meanCookingTimeInSec: 3333,
      }
    ];

    mockCookedItemsList = (readyToServeInPast = false, fillTakenForService = false) => ([
      {
        _id: 'cooked item id 1',
        cookableRecipe: mockRecipeList[0],
        preparationStarted: now.toISOString(),
        readyToServe: readyToServeInPast
                        ? (new Date(now.getTime() - mockRecipeList[0].meanCookingTimeInSec * 1000)).toISOString()
                        : (new Date(now.getTime() + mockRecipeList[0].meanCookingTimeInSec * 1000)).toISOString(),
        takenForService: fillTakenForService ? (new Date(now.getTime() + 60 * 1000)).toISOString() : null,
      },
      {
        _id: 'cooked item id 2',
        cookableRecipe: mockRecipeList[1],
        preparationStarted: now.toISOString(),
        readyToServe: readyToServeInPast
                        ? (new Date(now.getTime() - mockRecipeList[1].meanCookingTimeInSec * 1000)).toISOString()
                        : (new Date(now.getTime() + mockRecipeList[1].meanCookingTimeInSec * 1000)).toISOString(),
        takenForService: fillTakenForService ? (new Date(now.getTime() + 60 * 1000)).toISOString() : null,
      },
      {
        _id: 'cooked item id 3',
        cookableRecipe: mockRecipeList[2],
        preparationStarted: now.toISOString(),
        readyToServe: readyToServeInPast
                        ? (new Date(now.getTime() - mockRecipeList[2].meanCookingTimeInSec * 1000)).toISOString()
                        : (new Date(now.getTime() + mockRecipeList[2].meanCookingTimeInSec * 1000)).toISOString(),
        takenForService: fillTakenForService ? (new Date(now.getTime() + 60 * 1000)).toISOString() : null,
      }
    ]);

    transformCookedItem = (cookedItem) => ({
      _id: cookedItem._id,
      readyToServe: cookedItem.readyToServe,
    });

    transformCookedItems = (cookedItems) => cookedItems.map((cookedItem) => transformCookedItem(cookedItem));

    mockItemToBeCookedDto = {
      menuItemShortName: 'MI1',
      howMany: 4,
    };

    mockCookStateQueryParams = {
      state: CookStateEnum.READY_TO_BE_SERVED,
    };

    mockCookedItemIdParams = {
      cookedItemId: mockCookedItemsList()[0]._id,
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CookedItemsService,
        {
          provide: getModelToken('Recipe'),
          useValue: {
            findOne: jest.fn(),
          },
        },
        {
          provide: getModelToken('CookedItem'),
          useValue: {
            findOne: jest.fn(),
            create: jest.fn(),
            find: jest.fn(),
            findByIdAndUpdate: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<CookedItemsService>(CookedItemsService);
    model = module.get<Model<CookedItem>>(getModelToken('CookedItem'));
    recipeModel = module.get<Model<Recipe>>(getModelToken('Recipe'));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('findOne', () => {
    it('should return the searched cookedItem', async () => {
      const mockCookedItem = mockCookedItemsList()[0];
      jest.spyOn(model, 'findOne').mockReturnValue({
        lean: jest.fn().mockResolvedValueOnce(mockCookedItem),
      } as any);
      const cookedItem = await service.findOne(mockCookedItem._id);
      expect(cookedItem).toEqual(mockCookedItem);
    });

    it('should return CookedItemIdNotFoundException if the searched cookedItem is not found', async () => {
      jest.spyOn(model, 'findOne').mockReturnValue({
        lean: jest.fn().mockResolvedValueOnce(null),
      } as any);

      const testFindOne = async () => {
        await service.findOne('unknown cooked item id');
      };
      await expect(testFindOne).rejects.toThrow(CookedItemIdNotFoundException);
    });
  });

  describe('cookItems', () => {
    it('should create some new cookedItems', async () => {
      const mockCookedItem = mockCookedItemsList()[0];
      const mockRecipe = mockCookedItem.cookableRecipe;

      jest.spyOn(recipeModel, 'findOne').mockReturnValue({
        lean: jest.fn().mockResolvedValueOnce(mockRecipe),
      } as any);

      jest.spyOn(model, 'create').mockImplementation(() =>
        Promise.resolve(mockCookedItem),
      );

      const mockResult = new Array(mockItemToBeCookedDto.howMany).fill(mockCookedItem);

      const newCookedItems = await service.cookItems(mockItemToBeCookedDto);
      expect(newCookedItems).toEqual(mockResult);
    });

    it ('should return ItemToBeCookedNotFoundException if the searched item to be cooked is not found', async () => {
      jest.spyOn(recipeModel, 'findOne').mockReturnValue({
        lean: jest.fn().mockResolvedValueOnce(null),
      } as any);

      const testCookItems = async () => {
        await service.cookItems(mockItemToBeCookedDto);
      };
      await expect(testCookItems).rejects.toThrow(ItemToBeCookedNotFoundException);
    });
  });

  describe('findByCookState', () => {
    it('should return filtered cookedItems when state === CookStateEnum.READY_TO_BE_SERVED', async () => {
      const mockCookedItems = [mockCookedItemsList()[0]];

      jest.spyOn(model, 'find').mockReturnValue({
        lean: jest.fn().mockResolvedValueOnce(mockCookedItems),
      } as any);

      const foundCookedItems = await service.findByCookState(CookStateEnum.READY_TO_BE_SERVED);
      expect(foundCookedItems).toEqual(mockCookedItems);
    });

    it('should return filtered cookedItems when state === CookStateEnum.PREPARATION_STARTED', async () => {
      const mockCookedItems = [mockCookedItemsList()[0]];

      jest.spyOn(model, 'find').mockReturnValue({
        lean: jest.fn().mockResolvedValueOnce(mockCookedItems),
      } as any);

      const foundCookedItems = await service.findByCookState(CookStateEnum.PREPARATION_STARTED);
      expect(foundCookedItems).toEqual(mockCookedItems);
    });

    it ('should return WrongQueryParameterException if the cook state in param is not a valid one', async () => {
      jest.spyOn(recipeModel, 'findOne').mockReturnValue({
        lean: jest.fn().mockResolvedValueOnce(null),
      } as any);

      const testFindByCookState = async () => {
        // @ts-ignore
        await service.findByCookState('unknown cook state');
      };
      await expect(testFindByCookState).rejects.toThrow(WrongQueryParameterException);
    });
  });

  describe('isTakenForService', () => {
    it('should return an updated CookedItem', async () => {
      const mockCookedItem = mockCookedItemsList(true)[0];
      const mockUpdatedCookedItem = mockCookedItemsList(true, true)[0];

      jest.spyOn(service, 'findOne').mockImplementationOnce(() =>
        Promise.resolve(mockCookedItem),
      );

      jest.spyOn(model, 'findByIdAndUpdate').mockResolvedValueOnce(mockUpdatedCookedItem);

      const updatedCookedItem = await service.isTakenForService(mockCookedItem._id);
      expect(updatedCookedItem).toEqual(mockUpdatedCookedItem);
    });

    it ('should return CookedItemAlreadyTakenFromKitchenException if the cookItem is already taken from kitchen', async () => {
      const mockCookedItem = mockCookedItemsList(true, true)[0];

      jest.spyOn(service, 'findOne').mockImplementationOnce(() =>
        Promise.resolve(mockCookedItem),
      );

      const testIsTakenForService = async () => {
        // @ts-ignore
        await service.isTakenForService(mockCookedItem._id);
      };
      await expect(testIsTakenForService).rejects.toThrow(CookedItemAlreadyTakenFromKitchenException);
    });

    it ('should return CookedItemNotReadyInKitchenYetException if the cookItem is not ready in kitchen yet', async () => {
      const mockCookedItem = mockCookedItemsList()[0];

      jest.spyOn(service, 'findOne').mockImplementationOnce(() =>
        Promise.resolve(mockCookedItem),
      );

      const testIsTakenForService = async () => {
        // @ts-ignore
        await service.isTakenForService(mockCookedItem._id);
      };
      await expect(testIsTakenForService).rejects.toThrow(CookedItemNotReadyInKitchenYetException);
    });
  });
});
