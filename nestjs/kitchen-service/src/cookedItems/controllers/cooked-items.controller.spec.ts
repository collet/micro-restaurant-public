import { Test, TestingModule } from '@nestjs/testing';

import { CookedItemsController } from './cooked-items.controller';

import { CookedItemsService } from '../services/cooked-items.service';

import { Recipe } from '../../shared/schemas/recipe.schema';
import { CookStateEnum } from '../schemas/cook-state-enum.schema';

import { ItemToBeCookedDto } from '../dto/item-to-be-cooked.dto';

import { CookStateQueryParams } from '../params/cook-state.query-params';
import { CookedItemIdParams } from '../params/cooked-item-id.params';

describe('CookedItemsController', () => {
  let controller: CookedItemsController;
  let service: CookedItemsService;

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

    mockCookedItemsList = (fillTakenForService = false) => ([
      {
        _id: 'cooked item id 1',
        cookableRecipe: mockRecipeList[0],
        preparationStarted: now.toISOString(),
        readyToServe: (new Date(now.getTime() + mockRecipeList[0].meanCookingTimeInSec * 1000)).toISOString(),
        takenForService: fillTakenForService ? (new Date(now.getTime() + 60 * 1000)).toISOString() : null,
      },
      {
        _id: 'cooked item id 2',
        cookableRecipe: mockRecipeList[1],
        preparationStarted: now.toISOString(),
        readyToServe: (new Date(now.getTime() + mockRecipeList[1].meanCookingTimeInSec * 1000)).toISOString(),
        takenForService: fillTakenForService ? (new Date(now.getTime() + 60 * 1000)).toISOString() : null,
      },
      {
        _id: 'cooked item id 3',
        cookableRecipe: mockRecipeList[2],
        preparationStarted: now.toISOString(),
        readyToServe: (new Date(now.getTime() + mockRecipeList[2].meanCookingTimeInSec * 1000)).toISOString(),
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
      controllers: [CookedItemsController],
      providers: [
        {
          provide: CookedItemsService,
          useValue: {
            findOne: jest.fn(),
            cookItems: jest.fn(),
            findByCookState: jest.fn(),
            isTakenForService: jest.fn(),
          },
        },
      ],
    }).compile();

    controller = module.get<CookedItemsController>(CookedItemsController);
    service = module.get<CookedItemsService>(CookedItemsService);
  });

  describe('sendItemsToCook()', () => {
    it('should return an array of cookedItems', async () => {
      const createSpy = jest
        .spyOn(service, 'cookItems')
        .mockResolvedValueOnce(mockCookedItemsList());

      expect(controller.sendItemsToCook(mockItemToBeCookedDto)).resolves.toEqual(transformCookedItems(mockCookedItemsList()));
      expect(createSpy).toHaveBeenCalledWith(mockItemToBeCookedDto);
    });
  });

  describe('getCookedItemsByCookState()', () => {
    it('should return an array of cookedItems filtered by state', async () => {
      const createSpy = jest
        .spyOn(service, 'findByCookState')
        .mockResolvedValueOnce([mockCookedItemsList()[0]]);

      expect(controller.getCookedItemsByCookState(mockCookStateQueryParams)).resolves.toEqual(transformCookedItems([mockCookedItemsList()[0]]));
      expect(createSpy).toHaveBeenCalledWith(mockCookStateQueryParams.state);
    });
  });

  describe('itemIsServed()', () => {
    it('should return the cookedItem served', async () => {
      const createSpy = jest
        .spyOn(service, 'isTakenForService')
        .mockResolvedValueOnce(mockCookedItemsList()[0]);

      expect(controller.itemIsServed(mockCookedItemIdParams)).resolves.toEqual(transformCookedItem(mockCookedItemsList()[0]));
      expect(createSpy).toHaveBeenCalledWith(mockCookedItemIdParams.cookedItemId);
    });
  });
});
