import { Test, TestingModule } from '@nestjs/testing';
import { getModelToken } from '@nestjs/mongoose';
import { Model } from 'mongoose';

import * as _cloneDeep from 'lodash/cloneDeep';

import { PreparedItemsService } from './prepared-items.service';
import { KitchenFacadeService } from '../../kitchenFacade/services/kitchen-facade.service';

import { PreparedItem } from '../schemas/prepared-item.schema';
import { Recipe } from '../../shared/schemas/recipe.schema';
import { PostEnum } from '../../shared/schemas/post-enum.schema';
import { PreparedItemIdNotFoundException } from '../exceptions/prepared-item-id-not-found.exception';
import { ItemAlreadyStartedToBeCookedException } from '../exceptions/item-already-started-to-be-cooked.exception';
import { ItemNotStartedToBeCookedException } from '../exceptions/item-not-started-to-be-cooked.exception';
import { ItemAlreadyFinishedToBeCookedException } from '../exceptions/item-already-finished-to-be-cooked.exception';

describe('PreparedItemsService', () => {
  let service: PreparedItemsService;
  let model: Model<PreparedItem>;
  let kitchenFacadeService: KitchenFacadeService;

  let mockedRecipes: Recipe[];
  let mockPreparedItemsList: PreparedItem[];

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

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        PreparedItemsService,
        {
          provide: getModelToken('PreparedItem'),
          useValue: {
            findOne: jest.fn(),
            find: jest.fn(),
            findByIdAndUpdate: jest.fn(),
          },
        },
        {
          provide: KitchenFacadeService,
          useValue: {
            checkAndUpdatePreparation: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<PreparedItemsService>(PreparedItemsService);
    model = module.get<Model<PreparedItem>>(getModelToken('PreparedItem'));
    kitchenFacadeService = module.get<KitchenFacadeService>(KitchenFacadeService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('findPreparedItemById', () => {
    it('should return the prepared item corresponding to the prepared item id with the recipe', async () => {
      jest.spyOn(model, 'findOne').mockReturnValue({
        populate: jest.fn().mockReturnValue({
          lean: jest.fn().mockResolvedValueOnce(mockPreparedItemsList[0]),
        }),
      } as any);

      const preparedItem = await service.findPreparedItemById(mockPreparedItemsList[0]._id);
      expect(preparedItem).toEqual(mockPreparedItemsList[0]);
    });

    it('should return the prepared item corresponding to the prepared item id without the recipe', async () => {
      jest.spyOn(model, 'findOne').mockReturnValue({
        lean: jest.fn().mockResolvedValueOnce(mockPreparedItemsList[0]),
      } as any);

      const preparedItem = await service.findPreparedItemById(mockPreparedItemsList[0]._id, false);
      expect(preparedItem).toEqual(mockPreparedItemsList[0]);
    });

    it('should return PreparedItemIdNotFoundException if prepared item id is not valid', async () => {
      jest.spyOn(model, 'findOne').mockReturnValue({
        populate: jest.fn().mockReturnValue({
          lean: jest.fn().mockResolvedValueOnce(null),
        }),
      } as any);

      const testFindPreparedItemById = async () => {
        await service.findPreparedItemById(mockPreparedItemsList[0]._id);
      };
      await expect(testFindPreparedItemById).rejects.toThrow(PreparedItemIdNotFoundException);
    });
  });

  describe('getAllItemsToStartCookingNow', () => {
    it('should return the prepared items corresponding to the post in params', async () => {
      jest.spyOn(model, 'find').mockReturnValue({
        sort: jest.fn().mockReturnValue({
          populate: jest.fn().mockReturnValue({
            lean: jest.fn().mockResolvedValueOnce(mockPreparedItemsList),
          }),
        }),
      } as any);

      const preparedItems = await service.getAllItemsToStartCookingNow(PostEnum.BAR);
      expect(preparedItems).toEqual([mockPreparedItemsList[0], mockPreparedItemsList[1]]);
    });
  });

  describe('startCookingItem', () => {
    it('should return the prepared item corresponding to the prepared item id in params', async () => {
      jest.spyOn(service, 'findPreparedItemById').mockImplementationOnce(() =>
        Promise.resolve(mockPreparedItemsList[0]),
      );

      const mockPreparedItemResult = _cloneDeep(mockPreparedItemsList[0]);
      mockPreparedItemResult.startedAt = new Date();

      jest.spyOn(model, 'findByIdAndUpdate').mockReturnValue({
        populate: jest.fn().mockResolvedValueOnce(mockPreparedItemResult),
      } as any);

      const preparedItem = await service.startCookingItem(mockPreparedItemsList[0]._id);
      expect(preparedItem).toEqual(mockPreparedItemResult);
    });

    it('should return ItemAlreadyStartedToBeCookedException if prepared item was already started', async () => {
      const mockPreparedItem = _cloneDeep(mockPreparedItemsList[0]);
      mockPreparedItem.startedAt = new Date();

      jest.spyOn(service, 'findPreparedItemById').mockImplementationOnce(() =>
        Promise.resolve(mockPreparedItem),
      );

      const testStartCookingItem = async () => {
        await service.startCookingItem(mockPreparedItem._id);
      };
      await expect(testStartCookingItem).rejects.toThrow(ItemAlreadyStartedToBeCookedException);
    });
  });

  describe('finishCookingItem', () => {
    it('should return the prepared item corresponding to the prepared item id in params', async () => {
      const mockPreparedItem = _cloneDeep(mockPreparedItemsList[0]);
      mockPreparedItem.startedAt = new Date();

      jest.spyOn(service, 'findPreparedItemById').mockImplementationOnce(() =>
        Promise.resolve(mockPreparedItem),
      );

      const mockPreparedItemResult = _cloneDeep(mockPreparedItemsList[0]);
      mockPreparedItemResult.startedAt = new Date();
      mockPreparedItemResult.finishedAt = new Date();

      jest.spyOn(model, 'findByIdAndUpdate').mockReturnValue({
        lean: jest.fn().mockResolvedValueOnce(mockPreparedItemResult),
      } as any);

      jest.spyOn(kitchenFacadeService, 'checkAndUpdatePreparation').mockImplementationOnce(() =>
        Promise.resolve(),
      );

      const preparedItem = await service.finishCookingItem(mockPreparedItem._id);
      expect(preparedItem).toEqual(mockPreparedItemResult);
    });

    it('should return ItemNotStartedToBeCookedException if prepared item was not already started', async () => {
      jest.spyOn(service, 'findPreparedItemById').mockImplementationOnce(() =>
        Promise.resolve(mockPreparedItemsList[0]),
      );

      const testFinishCookingItem = async () => {
        await service.finishCookingItem(mockPreparedItemsList[0]._id);
      };
      await expect(testFinishCookingItem).rejects.toThrow(ItemNotStartedToBeCookedException);
    });

    it('should return ItemAlreadyFinishedToBeCookedException if prepared item was already finished', async () => {
      const mockPreparedItem = _cloneDeep(mockPreparedItemsList[0]);
      mockPreparedItem.startedAt = new Date();
      mockPreparedItem.finishedAt = new Date();

      jest.spyOn(service, 'findPreparedItemById').mockImplementationOnce(() =>
        Promise.resolve(mockPreparedItem),
      );

      const testFinishCookingItem = async () => {
        await service.finishCookingItem(mockPreparedItem._id);
      };
      await expect(testFinishCookingItem).rejects.toThrow(ItemAlreadyFinishedToBeCookedException);
    });
  });
});
