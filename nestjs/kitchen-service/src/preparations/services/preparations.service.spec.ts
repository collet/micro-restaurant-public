import { Test, TestingModule } from '@nestjs/testing';
import { getModelToken } from '@nestjs/mongoose';
import { Model } from 'mongoose';

import * as _cloneDeep from 'lodash/cloneDeep';

import { PreparationsService } from './preparations.service';
import { DiningProxyService } from './dining-proxy.service';
import { KitchenFacadeService } from '../../kitchenFacade/services/kitchen-facade.service';

import { Preparation } from '../schemas/preparation.schema';
import { Recipe } from '../../shared/schemas/recipe.schema';
import { PostEnum } from '../../shared/schemas/post-enum.schema';
import { PreparedItem } from '../../preparedItems/schemas/prepared-item.schema';
import { PreparationStateEnum } from '../schemas/preparation-state-enum.schema';

import { ItemToBeCookedDto } from '../dto/item-to-be-cooked.dto';
import { PreparationRequestDto } from '../dto/preparation-request.dto';

import { TableNumberNotFoundException } from '../exceptions/table-number-not-found.exception';
import { WrongQueryParameterException } from '../exceptions/wrong-query-parameter.exception';
import { EmptyItemsToBeCookedSentInKitchenException } from '../exceptions/empty-items-to-be-cooked-sent-in-kitchen.exception';
import { ItemsToBeCookedNotFoundException } from '../exceptions/items-to-be-cooked-not-found.exception';
import { PreparationIdNotFoundException } from '../exceptions/preparation-id-not-found.exception';
import { PreparationNotReadyInKitchenException } from '../exceptions/preparation-not-ready-in-kitchen.exception';
import { PreparationAlreadyTakenFromKitchenException } from '../exceptions/preparation-already-taken-from-kitchen.exception';

describe('PreparationsService', () => {
  let service: PreparationsService;
  let model: Model<Preparation>;
  let recipeModel: Model<Recipe>;
  let kitchenFacadeService: KitchenFacadeService;
  let diningProxyService: DiningProxyService;

  let mockedRecipes: Recipe[];
  let mockPreparedItemsList: PreparedItem[];
  let mockPreparationsList: Preparation[];
  let mockTableNumber: number;
  let mockItemToBeCookedList: ItemToBeCookedDto[];
  let mockPreparationRequestDto: PreparationRequestDto;
  let mockPreparationRequestDtoWithEmptyItemsToBeCooked: PreparationRequestDto;

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

    mockPreparationRequestDto = {
      tableNumber: 1,
      itemsToBeCooked: mockItemToBeCookedList,
    };

    mockPreparationRequestDtoWithEmptyItemsToBeCooked = {
      tableNumber: 1,
      itemsToBeCooked: [],
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        PreparationsService,
        {
          provide: getModelToken('Recipe'),
          useValue: {
            findOne: jest.fn(),
          },
        },
        {
          provide: getModelToken('Preparation'),
          useValue: {
            find: jest.fn(),
            findOne: jest.fn(),
            findByIdAndUpdate: jest.fn(),
          },
        },
        {
          provide: DiningProxyService,
          useValue: {
            isTableNumberValid: jest.fn(),
          },
        },
        {
          provide: KitchenFacadeService,
          useValue: {
            receivePreparation: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<PreparationsService>(PreparationsService);
    recipeModel = module.get<Model<Recipe>>(getModelToken('Recipe'));
    model = module.get<Model<Preparation>>(getModelToken('Preparation'));
    diningProxyService = module.get<DiningProxyService>(DiningProxyService);
    kitchenFacadeService = module.get<KitchenFacadeService>(KitchenFacadeService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('findByStateAndTableNumber', () => {
    it('should return all preparations matching the search if tableNumber is not null and state is PREPARATION_STARTED', async () => {
      jest.spyOn(diningProxyService, 'isTableNumberValid').mockImplementationOnce(() =>
        Promise.resolve(true),
      );

      jest.spyOn(model, 'find').mockReturnValue({
        populate: jest.fn().mockReturnValue({
          lean: jest.fn().mockResolvedValueOnce(mockPreparationsList),
        }),
      } as any);
      const preparations = await service.findByStateAndTableNumber(PreparationStateEnum.PREPARATION_STARTED, mockTableNumber);
      expect(preparations).toEqual(mockPreparationsList);
    });

    it('should return all preparations matching the search if tableNumber is not null and state is READY_TO_BE_SERVED', async () => {
      jest.spyOn(diningProxyService, 'isTableNumberValid').mockImplementationOnce(() =>
        Promise.resolve(true),
      );

      jest.spyOn(model, 'find').mockReturnValue({
        populate: jest.fn().mockReturnValue({
          lean: jest.fn().mockResolvedValueOnce(mockPreparationsList),
        }),
      } as any);
      const preparations = await service.findByStateAndTableNumber(PreparationStateEnum.READY_TO_BE_SERVED, mockTableNumber);
      expect(preparations).toEqual(mockPreparationsList);
    });

    it('should return all preparations matching the search if tableNumber is null and state is PREPARATION_STARTED', async () => {
      jest.spyOn(model, 'find').mockReturnValue({
        populate: jest.fn().mockReturnValue({
          lean: jest.fn().mockResolvedValueOnce(mockPreparationsList),
        }),
      } as any);
      const preparations = await service.findByStateAndTableNumber(PreparationStateEnum.PREPARATION_STARTED);
      expect(preparations).toEqual(mockPreparationsList);
    });

    it('should return all preparations matching the search if tableNumber is null and state is READY_TO_BE_SERVED', async () => {
      jest.spyOn(model, 'find').mockReturnValue({
        populate: jest.fn().mockReturnValue({
          lean: jest.fn().mockResolvedValueOnce(mockPreparationsList),
        }),
      } as any);
      const preparations = await service.findByStateAndTableNumber(PreparationStateEnum.READY_TO_BE_SERVED);
      expect(preparations).toEqual(mockPreparationsList);
    });

    it('should return TableNumberNotFoundException if tableNumber is not valid', async () => {
      jest.spyOn(diningProxyService, 'isTableNumberValid').mockImplementationOnce(() =>
        Promise.resolve(false),
      );

      const testFindByStateAndTableNumber = async () => {
        await service.findByStateAndTableNumber(PreparationStateEnum.PREPARATION_STARTED, 20);
      };
      await expect(testFindByStateAndTableNumber).rejects.toThrow(TableNumberNotFoundException);
    });

    it('should return WrongQueryParameterException if state is not valid', async () => {
      const testFindByStateAndTableNumber = async () => {
        await service.findByStateAndTableNumber('Invalid state' as PreparationStateEnum);
      };
      await expect(testFindByStateAndTableNumber).rejects.toThrow(WrongQueryParameterException);
    });
  });

  describe('cookItems', () => {
    it('should return all preparations corresponding to the request', async () => {
      jest.spyOn(diningProxyService, 'isTableNumberValid').mockImplementationOnce(() =>
        Promise.resolve(true),
      );

      jest.spyOn(recipeModel, 'findOne').mockReturnValue({
        lean: jest.fn().mockResolvedValue(mockedRecipes[1]),
      } as any);

      jest.spyOn(kitchenFacadeService, 'receivePreparation').mockImplementationOnce(() =>
        Promise.resolve(mockPreparationsList),
      );

      const preparations = await service.cookItems(mockPreparationRequestDto);
      expect(preparations).toEqual(mockPreparationsList);
    });

    it('should return TableNumberNotFoundException if tableNumber is not valid', async () => {
      jest.spyOn(diningProxyService, 'isTableNumberValid').mockImplementationOnce(() =>
        Promise.resolve(false),
      );

      const testCookItems = async () => {
        await service.cookItems(mockPreparationRequestDto);
      };
      await expect(testCookItems).rejects.toThrow(TableNumberNotFoundException);
    });

    it('should return EmptyItemsToBeCookedSentInKitchenException if itemsToBeCooked is empty', async () => {
      jest.spyOn(diningProxyService, 'isTableNumberValid').mockImplementationOnce(() =>
        Promise.resolve(true),
      );

      const testCookItems = async () => {
        await service.cookItems(mockPreparationRequestDtoWithEmptyItemsToBeCooked);
      };
      await expect(testCookItems).rejects.toThrow(EmptyItemsToBeCookedSentInKitchenException);
    });

    it('should return ItemsToBeCookedNotFoundException if recipes are not found', async () => {
      jest.spyOn(diningProxyService, 'isTableNumberValid').mockImplementationOnce(() =>
        Promise.resolve(true),
      );

      jest.spyOn(recipeModel, 'findOne').mockReturnValue({
        lean: jest.fn().mockResolvedValue(null),
      } as any);

      const testCookItems = async () => {
        await service.cookItems(mockPreparationRequestDto);
      };
      await expect(testCookItems).rejects.toThrow(ItemsToBeCookedNotFoundException);
    });
  });

  describe('findPreparationById', () => {
    it('should return the preparation corresponding to the preparation id', async () => {
      jest.spyOn(model, 'findOne').mockReturnValue({
        populate: jest.fn().mockReturnValue({
          lean: jest.fn().mockResolvedValueOnce(mockPreparationsList[0]),
        }),
      } as any);

      const preparation = await service.findPreparationById(mockPreparationsList[0]._id);
      expect(preparation).toEqual(mockPreparationsList[0]);
    });

    it('should return PreparationIdNotFoundException if preparation id is not valid', async () => {
      jest.spyOn(model, 'findOne').mockReturnValue({
        populate: jest.fn().mockReturnValue({
          lean: jest.fn().mockResolvedValueOnce(null),
        }),
      } as any);

      const testFindPreparationById = async () => {
        await service.findPreparationById(mockPreparationsList[0]._id);
      };
      await expect(testFindPreparationById).rejects.toThrow(PreparationIdNotFoundException);
    });
  });

  describe('isTakenForService', () => {
    it('should return the preparation corresponding to the preparation id', async () => {
      const mockPreparation = _cloneDeep(mockPreparationsList[0]);
      mockPreparation.completedAt = new Date();
      jest.spyOn(service, 'findPreparationById').mockImplementationOnce(() =>
        Promise.resolve(mockPreparation),
      );

      const mockPreparationResult = _cloneDeep(mockPreparationsList[0]);
      mockPreparationResult.completedAt = new Date();
      mockPreparationResult.takenForServiceAt = new Date();
      jest.spyOn(model, 'findByIdAndUpdate').mockReturnValue({
        populate: jest.fn().mockReturnValue({
          exec: jest.fn().mockResolvedValueOnce(mockPreparationResult),
        }),
      } as any);

      const preparation = await service.isTakenForService(mockPreparation._id);
      expect(preparation).toEqual(mockPreparationResult);
    });

    it('should return PreparationNotReadyInKitchenException if preparation is not completed', async () => {
      const mockPreparation = _cloneDeep(mockPreparationsList[0]);
      jest.spyOn(service, 'findPreparationById').mockImplementationOnce(() =>
        Promise.resolve(mockPreparation),
      );

      const testIsTakenForService = async () => {
        await service.isTakenForService(mockPreparation._id);
      };
      await expect(testIsTakenForService).rejects.toThrow(PreparationNotReadyInKitchenException);
    });

    it('should return PreparationAlreadyTakenFromKitchenException if preparation was already taken for service', async () => {
      const mockPreparation = _cloneDeep(mockPreparationsList[0]);
      mockPreparation.completedAt = new Date();
      mockPreparation.takenForServiceAt = new Date();
      jest.spyOn(service, 'findPreparationById').mockImplementationOnce(() =>
        Promise.resolve(mockPreparation),
      );

      const testIsTakenForService = async () => {
        await service.isTakenForService(mockPreparation._id);
      };
      await expect(testIsTakenForService).rejects.toThrow(PreparationAlreadyTakenFromKitchenException);
    });
  });
});
