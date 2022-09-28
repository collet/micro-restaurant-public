import { Test, TestingModule } from '@nestjs/testing';

import { PreparedItemsController } from './prepared-items.controller';
import { PreparedItemsService } from '../services/prepared-items.service';

import { PreparedItemIdParams } from '../params/prepared-item-id.params';
import { PostQueryParams } from '../params/post.query-params';

import { PreparedItem } from '../schemas/prepared-item.schema';
import { Recipe } from '../../shared/schemas/recipe.schema';
import { PostEnum } from '../../shared/schemas/post-enum.schema';

describe('PreparedItemsController', () => {
  let controller: PreparedItemsController;
  let service: PreparedItemsService;

  let mockedRecipes: Recipe[];
  let mockPreparedItemsList: PreparedItem[];
  let mockPreparedItemIdParams: PreparedItemIdParams;
  let mockPostQueryParams: PostQueryParams;

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

    mockPreparedItemIdParams = {
      preparedItemId: mockPreparedItemsList[0]._id,
    };

    mockPostQueryParams = {
      post: PostEnum.BAR,
    };

    const module: TestingModule = await Test.createTestingModule({
      controllers: [PreparedItemsController],
      providers: [
        {
          provide: PreparedItemsService,
          useValue: {
            findPreparedItemById: jest.fn(),
            getAllItemsToStartCookingNow: jest.fn(),
            startCookingItem: jest.fn(),
            finishCookingItem: jest.fn(),
          },
        },
      ],
    }).compile();

    controller = module.get<PreparedItemsController>(PreparedItemsController);
    service = module.get<PreparedItemsService>(PreparedItemsService);
  });

  describe('retrievePreparedItem()', () => {
    it('should return a prepared item', async () => {
      const serviceFunctionSpy = jest
        .spyOn(service, 'findPreparedItemById')
        .mockResolvedValueOnce(mockPreparedItemsList[0]);

      expect(controller.retrievePreparedItem(mockPreparedItemIdParams)).resolves.toEqual(mockPreparedItemsList[0]);
      expect(serviceFunctionSpy).toHaveBeenCalled();
    });
  });

  describe('retrievePreparedItemRecipe()', () => {
    it('should return the recipe linked to the prepared item', async () => {
      const serviceFunctionSpy = jest
        .spyOn(service, 'findPreparedItemById')
        .mockResolvedValueOnce(mockPreparedItemsList[0]);

      expect(controller.retrievePreparedItemRecipe(mockPreparedItemIdParams)).resolves.toEqual(mockPreparedItemsList[0].recipe);
      expect(serviceFunctionSpy).toHaveBeenCalled();
    });
  });

  describe('getPreparatedItemsToStartByPost()', () => {
    it('should return an array of prepared items', async () => {
      const serviceFunctionSpy = jest
        .spyOn(service, 'getAllItemsToStartCookingNow')
        .mockResolvedValueOnce(mockPreparedItemsList);

      expect(controller.getPreparatedItemsToStartByPost(mockPostQueryParams)).resolves.toEqual(mockPreparedItemsList);
      expect(serviceFunctionSpy).toHaveBeenCalled();
    });
  });

  describe('startToPrepareItemOnPost()', () => {
    it('should return the started prepared item', async () => {
      const serviceFunctionSpy = jest
        .spyOn(service, 'startCookingItem')
        .mockResolvedValueOnce(mockPreparedItemsList[0]);

      expect(controller.startToPrepareItemOnPost(mockPreparedItemIdParams)).resolves.toEqual(mockPreparedItemsList[0]);
      expect(serviceFunctionSpy).toHaveBeenCalled();
    });
  });

  describe('finishToPrepareItemOnPost()', () => {
    it('should return the finished prepared item', async () => {
      const serviceFunctionSpy = jest
        .spyOn(service, 'finishCookingItem')
        .mockResolvedValueOnce(mockPreparedItemsList[0]);

      expect(controller.finishToPrepareItemOnPost(mockPreparedItemIdParams)).resolves.toEqual(mockPreparedItemsList[0]);
      expect(serviceFunctionSpy).toHaveBeenCalled();
    });
  });
});
