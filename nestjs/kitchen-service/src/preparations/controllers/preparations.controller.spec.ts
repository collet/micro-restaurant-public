import { Test, TestingModule } from '@nestjs/testing';

import { PreparationsController } from './preparations.controller';
import { PreparationsService } from '../services/preparations.service';

import { StateTableNumberQueryParams } from '../params/state-table-number.query-params';

import { Preparation } from '../schemas/preparation.schema';
import { PreparedItem } from '../../preparedItems/schemas/prepared-item.schema';
import { Recipe } from '../../shared/schemas/recipe.schema';
import { PostEnum } from '../../shared/schemas/post-enum.schema';
import { PreparationStateEnum } from '../schemas/preparation-state-enum.schema';

describe('PreparationsController', () => {
  let controller: PreparationsController;
  let service: PreparationsService;

  let mockedRecipes: Recipe[];
  let mockPreparedItemsList: PreparedItem[];
  let mockPreparationsList: Preparation[];
  let mockStateTableNumberQueryParams: StateTableNumberQueryParams;

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

    mockStateTableNumberQueryParams = {
      state: PreparationStateEnum.PREPARATION_STARTED,
      tableNumber: 1,
    };

    const module: TestingModule = await Test.createTestingModule({
      controllers: [PreparationsController],
      providers: [
        {
          provide: PreparationsService,
          useValue: {
            findByStateAndTableNumber: jest.fn(),
            cookItems: jest.fn(),
            findPreparationById: jest.fn(),
            isTakenForService: jest.fn(),
          },
        },
      ],
    }).compile();

    controller = module.get<PreparationsController>(PreparationsController);
    service = module.get<PreparationsService>(PreparationsService);
  });

  describe('getAllPreparationsByStateAndTableNumber()', () => {
    it('should return an array of preparations', async () => {
      const serviceFunctionSpy = jest
        .spyOn(service, 'findByStateAndTableNumber')
        .mockResolvedValueOnce(mockPreparationsList);

      expect(controller.getAllPreparationsByStateAndTableNumber(mockStateTableNumberQueryParams)).resolves.toEqual(mockPreparationsList);
      expect(service.findByStateAndTableNumber).toHaveBeenCalled();
    });
  });
});
