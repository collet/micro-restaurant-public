import { Test, TestingModule } from '@nestjs/testing';
import { getModelToken } from '@nestjs/mongoose';
import { Model } from 'mongoose';

import * as _cloneDeep from 'lodash/cloneDeep';

import { KitchenFacadeService } from './kitchen-facade.service';

import { Recipe } from '../../shared/schemas/recipe.schema';
import { PostEnum } from '../../shared/schemas/post-enum.schema';
import { Preparation } from '../../preparations/schemas/preparation.schema';
import { PreparedItem } from '../../preparedItems/schemas/prepared-item.schema';

import { ItemToBeCookedDto } from '../../preparations/dto/item-to-be-cooked.dto';
import { RecipeWithItemToBeCookedInterface } from '../../shared/interfaces/recipe-with-item-to-be-cooked.interface';

import { RecipeNotFoundException } from '../exceptions/recipe-not-found.exception';
import { ErrorDto } from '../../shared/dto/error.dto';

describe('KitchenFacadeService', () => {
  let service: KitchenFacadeService;
  let recipeModel: Model<Recipe>;
  let preparationModel: Model<Preparation>;
  let preparedItemModel: Model<PreparedItem>;

  let mockedRecipes: Recipe[];
  let mockTableNumber: number;
  let mockItemToBeCookedList: ItemToBeCookedDto[];
  let mockedRecipeWithItemToBeCookedList: RecipeWithItemToBeCookedInterface[];
  let mockPreparedItemsList: PreparedItem[];
  let mockPreparationsList: Preparation[];

  beforeEach(async () => {
    mockedRecipes = [
      {
        _id: 'recipe 1',
        shortName: 'recipeshortname 1',
        post: PostEnum.BAR,
        cookingSteps: [
          'step 1',
          'step 2',
          'step 3',
        ],
        meanCookingTimeInSec: 20,
      },
      {
        _id: 'recipe 2',
        shortName: 'recipeshortname 2',
        post: PostEnum.HOT_DISH,
        cookingSteps: [
          'step 4',
          'step 5',
          'step 6',
        ],
        meanCookingTimeInSec: 10,
      },
      {
        _id: 'recipe 3',
        shortName: 'recipeshortname 3',
        post: PostEnum.COLD_DISH,
        cookingSteps: [
          'step 7',
          'step 8',
        ],
        meanCookingTimeInSec: 5,
      },
    ];

    mockTableNumber = 1;

    mockItemToBeCookedList = [
      {
        menuItemShortName: 'menu item shortname 1',
        howMany: 2,
      },
      {
        menuItemShortName: 'menu item shortname 2',
        howMany: 3,
      },
    ];

    mockedRecipeWithItemToBeCookedList = [
      {
        recipe: mockedRecipes[0],
        itemToBeCooked: mockItemToBeCookedList[0],
      },
      {
        recipe: mockedRecipes[1],
        itemToBeCooked: mockItemToBeCookedList[1],
      },
    ];

    mockPreparedItemsList = [
      {
        _id: 'prepared item 1',
        shortName: 'menu item shortname 1',
        recipe: mockedRecipes[0],
        shouldStartAt: new Date(),
        startedAt: null,
        finishedAt: null,
      },
      {
        _id: 'prepared item 2',
        shortName: 'menu item shortname 1',
        recipe: mockedRecipes[0],
        shouldStartAt: new Date(),
        startedAt: null,
        finishedAt: null,
      },
      {
        _id: 'prepared item 3',
        shortName: 'menu item shortname 3',
        recipe: mockedRecipes[1],
        shouldStartAt: new Date(),
        startedAt: null,
        finishedAt: null,
      },
      {
        _id: 'prepared item 4',
        shortName: 'menu item shortname 4',
        recipe: mockedRecipes[2],
        shouldStartAt: new Date(),
        startedAt: null,
        finishedAt: null,
      },
      {
        _id: 'prepared item 5',
        shortName: 'menu item shortname 4',
        recipe: mockedRecipes[2],
        shouldStartAt: new Date(),
        startedAt: null,
        finishedAt: null,
      },
      {
        _id: 'prepared item 6',
        shortName: 'menu item shortname 4',
        recipe: mockedRecipes[2],
        shouldStartAt: new Date(),
        startedAt: null,
        finishedAt: null,
      },
    ];

    mockPreparationsList = [
      {
        _id: 'preparation 1',
        tableNumber: 1,
        shouldBeReadyAt: new Date(),
        completedAt: null,
        takenForServiceAt: null,
        preparedItems: [
          mockPreparedItemsList[0],
          mockPreparedItemsList[1],
        ],
      },
      {
        _id: 'preparation 2',
        tableNumber: 1,
        shouldBeReadyAt: new Date(),
        completedAt: null,
        takenForServiceAt: null,
        preparedItems: [
          mockPreparedItemsList[2],
        ],
      },
      {
        _id: 'preparation 3',
        tableNumber: 1,
        shouldBeReadyAt: new Date(),
        completedAt: null,
        takenForServiceAt: null,
        preparedItems: [
          mockPreparedItemsList[3],
          mockPreparedItemsList[4],
          mockPreparedItemsList[5],
        ],
      },
    ];

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        KitchenFacadeService,
        {
          provide: getModelToken('Recipe'),
          useValue: {
            findOne: jest.fn(),
          },
        },
        {
          provide: getModelToken('Preparation'),
          useValue: {
            create: jest.fn(),
            find: jest.fn(),
            findByIdAndUpdate: jest.fn(),
          },
        },
        {
          provide: getModelToken('PreparedItem'),
          useValue: {
            create: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<KitchenFacadeService>(KitchenFacadeService);
    recipeModel = module.get<Model<Recipe>>(getModelToken('Recipe'));
    preparationModel = module.get<Model<Preparation>>(getModelToken('Preparation'));
    preparedItemModel = module.get<Model<PreparedItem>>(getModelToken('PreparedItem'));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('getRecipeFromMenuItemShortName', () => {
    it('should return the recipe corresponding to menu item short name in param', async () => {
      jest.spyOn(recipeModel, 'findOne').mockReturnValue({
        lean: jest.fn().mockResolvedValueOnce(mockedRecipes[0]),
      } as any);
      const recipe = await service.getRecipeFromMenuItemShortName(mockedRecipes[0].shortName);
      expect(recipe).toEqual(mockedRecipes[0]);
    });

    it('should return RecipeNotFoundException if recipe is not found', async () => {
      jest.spyOn(recipeModel, 'findOne').mockReturnValue({
        lean: jest.fn().mockResolvedValueOnce(null),
      } as any);

      const testGetRecipeFromMenuItemShortName = async () => {
        await service.getRecipeFromMenuItemShortName(mockedRecipes[0].shortName);
      };
      await expect(testGetRecipeFromMenuItemShortName).rejects.toThrow(RecipeNotFoundException);
    });
  });

  describe('computeMaxCookingTime', () => {
    it('should return max cooking time among all recipes in params', async () => {
      jest.spyOn(recipeModel, 'findOne').mockReturnValue({
        lean: jest.fn().mockResolvedValueOnce(mockedRecipes[0]),
      } as any);

      const maxCookingTime = await service.computeMaxCookingTime(mockedRecipeWithItemToBeCookedList);
      expect(maxCookingTime).toEqual(mockedRecipes[0].meanCookingTimeInSec);
    });
  });

  describe('createPreparedItem', () => {
    it('should create a Prepared Item with data in params', async () => {
      const mockShortName = mockPreparedItemsList[0].shortName;
      const mockRecipe = mockPreparedItemsList[0].recipe;
      const mockShouldStartAt = mockPreparedItemsList[0].shouldStartAt;

      jest.spyOn(preparedItemModel, 'create').mockImplementationOnce(() =>
        Promise.resolve(mockPreparedItemsList[0]),
      );

      const preparedItem = await service.createPreparedItem(mockShortName, mockRecipe, mockShouldStartAt);
      expect(preparedItem).toEqual(mockPreparedItemsList[0]);
    });
  });

  describe('startCookingProcess', () => {
    it('should create a Prepared Item with data in params', async () => {
      let i = 0;

      jest.spyOn(service, 'createPreparedItem').mockImplementation(() =>
        Promise.resolve(mockPreparedItemsList[i++]),
      );

      const preparedItems = await service.startCookingProcess(mockedRecipeWithItemToBeCookedList, 20);

      const length = mockedRecipeWithItemToBeCookedList.reduce((res, { itemToBeCooked }) => (res + itemToBeCooked.howMany), 0);

      expect(preparedItems).toEqual(Array.from({ length }, (_, j) => (mockPreparedItemsList[j])));
    });
  });

  describe('createPreparation', () => {
    it('should create a Preparation with data in params', async () => {
      const mockTableNumber = mockPreparationsList[0].tableNumber;
      const mockPreparedItems = mockPreparationsList[0].preparedItems;
      const mockShouldBeReadyAt = mockPreparationsList[0].shouldBeReadyAt;

      jest.spyOn(preparationModel, 'create').mockImplementationOnce(() =>
        Promise.resolve(mockPreparationsList[0]),
      );

      const preparation = await service.createPreparation(mockTableNumber, mockPreparedItems, mockShouldBeReadyAt);
      expect(preparation).toEqual(mockPreparationsList[0]);
    });
  });

  describe('receivePreparation', () => {
    it('should create the preparations list according to data in params: recipe belongs to PostEnum.BAR', async () => {
      jest.spyOn(service, 'getRecipeFromMenuItemShortName').mockImplementation(() =>
        Promise.resolve(mockedRecipes[0]),
      );

      jest.spyOn(service, 'startCookingProcess').mockImplementation(() =>
        Promise.resolve(mockPreparedItemsList),
      );

      jest.spyOn(service, 'createPreparation').mockImplementation(() =>
        Promise.resolve(mockPreparationsList[0]),
      );

      const preparations = await service.receivePreparation(mockTableNumber, mockItemToBeCookedList);
      expect(preparations).toEqual([mockPreparationsList[0]]);
    });

    it('should create the preparations list according to data in params: recipe belongs to PostEnum.HOT_DISH', async () => {
      jest.spyOn(service, 'getRecipeFromMenuItemShortName').mockImplementation(() =>
        Promise.resolve(mockedRecipes[1]),
      );

      jest.spyOn(service, 'startCookingProcess').mockImplementation(() =>
        Promise.resolve(mockPreparedItemsList),
      );

      jest.spyOn(service, 'createPreparation').mockImplementation(() =>
        Promise.resolve(mockPreparationsList[0]),
      );

      const preparations = await service.receivePreparation(mockTableNumber, mockItemToBeCookedList);
      expect(preparations).toEqual([mockPreparationsList[0]]);
    });

    it('should create the preparations list according to data in params: recipe belongs to PostEnum.COLD_DISH', async () => {
      jest.spyOn(service, 'getRecipeFromMenuItemShortName').mockImplementation(() =>
        Promise.resolve(mockedRecipes[2]),
      );

      jest.spyOn(service, 'startCookingProcess').mockImplementation(() =>
        Promise.resolve(mockPreparedItemsList),
      );

      jest.spyOn(service, 'createPreparation').mockImplementation(() =>
        Promise.resolve(mockPreparationsList[0]),
      );

      const preparations = await service.receivePreparation(mockTableNumber, mockItemToBeCookedList);
      expect(preparations).toEqual([mockPreparationsList[0]]);
    });
  });

  describe('checkAndUpdatePreparation', () => {
    it('should update Preparation according to prepared item in params: not completed', async () => {
      jest.spyOn(preparationModel, 'find').mockReturnValue({
        populate: jest.fn().mockReturnValue({
          exec: jest.fn().mockResolvedValueOnce([mockPreparationsList[0]]),
        }),
      } as any);

      jest.spyOn(preparationModel, 'findByIdAndUpdate').mockReturnValue(null);

      await service.checkAndUpdatePreparation(mockPreparedItemsList[0]);
      expect(preparationModel.find).toHaveBeenCalled();
      expect(preparationModel.findByIdAndUpdate).not.toHaveBeenCalled();
    });

    it('should update Preparation according to prepared item in params: completed', async () => {
      const mockPreparation = _cloneDeep(mockPreparationsList[0]);
      mockPreparation.preparedItems = mockPreparation.preparedItems.map((preparedItem) => {
        preparedItem.finishedAt = new Date();
        return preparedItem;
      });
      jest.spyOn(preparationModel, 'find').mockReturnValue({
        populate: jest.fn().mockReturnValue({
          exec: jest.fn().mockResolvedValueOnce([mockPreparation]),
        }),
      } as any);

      jest.spyOn(preparationModel, 'findByIdAndUpdate').mockReturnValue(null);

      await service.checkAndUpdatePreparation(mockPreparedItemsList[0]);
      expect(preparationModel.find).toHaveBeenCalled();
      expect(preparationModel.findByIdAndUpdate).toHaveBeenCalled();
    });

    it('should return an ErrorDto if preparation doesn\'t exit', async () => {
      jest.spyOn(preparationModel, 'find').mockReturnValue({
        populate: jest.fn().mockReturnValue({
          exec: jest.fn().mockResolvedValueOnce([]),
        }),
      } as any);

      const testCheckAndUpdatePreparation = async () => {
        await service.checkAndUpdatePreparation(mockPreparedItemsList[0])
      };
      await expect(testCheckAndUpdatePreparation).rejects.toThrow(ErrorDto);
    });

    it('should return an ErrorDto if more than 1 preparation were found', async () => {
      jest.spyOn(preparationModel, 'find').mockReturnValue({
        populate: jest.fn().mockReturnValue({
          exec: jest.fn().mockResolvedValueOnce(mockPreparationsList),
        }),
      } as any);

      const testCheckAndUpdatePreparation = async () => {
        await service.checkAndUpdatePreparation(mockPreparedItemsList[0])
      };
      await expect(testCheckAndUpdatePreparation).rejects.toThrow(ErrorDto);
    });
  });
});
