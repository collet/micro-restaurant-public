import { Test, TestingModule } from '@nestjs/testing';
import { ConfigService } from '@nestjs/config';
import { HttpService } from '@nestjs/axios';
import { of } from 'rxjs';

import { DependenciesConfig } from '../../shared/config/interfaces/dependencies-config.interface';

import { KitchenProxyService } from './kitchen-proxy.service';

import { OrderingItem } from '../schemas/ordering-item.schema';
import { OrderingLine } from '../schemas/ordering-line.schema';

import { PreparationDto } from '../dto/preparation.dto';

describe('KitchenProxyService', () => {
  let service: KitchenProxyService;
  let configService: ConfigService;
  let httpService: HttpService;

  let now: Date;
  let mockDependenciesConfig: DependenciesConfig;

  let mockOrderingItem: OrderingItem;
  let mockOrderingLines: OrderingLine[];
  let mockRecipeList;
  let mockTableNumbers: number;
  let mockPreparations: Function;
  let postSendItemsToCookAxiosResponse: Function;

  beforeEach(async () => {
    now = new Date();

    mockDependenciesConfig = {
      menu_service_url_with_port: 'menu_service_url:port',
      kitchen_service_url_with_port: 'kitchen_service_url_with_port:port',
    };

    mockOrderingItem = {
      _id: 'menu item id 1',
      shortName: 'menu item shortname 1',
    };

    mockOrderingLines = [
      {
        item: mockOrderingItem,
        howMany: 1,
        sentForPreparation: false,
      },
      {
        item: mockOrderingItem,
        howMany: 2,
        sentForPreparation: false,
      }
    ];

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

    mockTableNumbers = 1;

    mockPreparations = (shouldBeReadyAtInPast = false) => ([
      {
        _id: 'cooked item id 1',
        shouldBeReadyAt: shouldBeReadyAtInPast
          ? (new Date(now.getTime() - mockRecipeList[0].meanCookingTimeInSec * 1000)).toISOString()
          : (new Date(now.getTime() + mockRecipeList[0].meanCookingTimeInSec * 1000)).toISOString(),
        preparedItems: [
          {
            _id: 'prepared item 1',
            shortName: 'menu item shortname',
          }
        ],
      },
      {
        _id: 'cooked item id 2',
        shouldBeReadyAt: shouldBeReadyAtInPast
          ? (new Date(now.getTime() - mockRecipeList[1].meanCookingTimeInSec * 1000)).toISOString()
          : (new Date(now.getTime() + mockRecipeList[1].meanCookingTimeInSec * 1000)).toISOString(),
        preparedItems: [
          {
            _id: 'prepared item 1',
            shortName: 'menu item shortname',
          }
        ],
      },
      {
        _id: 'cooked item id 3',
        shouldBeReadyAt: shouldBeReadyAtInPast
          ? (new Date(now.getTime() - mockRecipeList[2].meanCookingTimeInSec * 1000)).toISOString()
          : (new Date(now.getTime() + mockRecipeList[2].meanCookingTimeInSec * 1000)).toISOString(),
        preparedItems: [
          {
            _id: 'prepared item 1',
            shortName: 'menu item shortname',
          }
        ],
      }
    ]);

    postSendItemsToCookAxiosResponse = (data) => ({
      data,
      headers: {},
      config: { url: `http://${mockDependenciesConfig.kitchen_service_url_with_port}/cookedItems` },
      status: 200,
      statusText: 'OK',
    });


    const module: TestingModule = await Test.createTestingModule({
      providers: [
        KitchenProxyService,
        {
          provide: ConfigService,
          useValue: {
            get: jest.fn().mockResolvedValue(mockDependenciesConfig),
          },
        },
        {
          provide: HttpService,
          useValue: {
            post: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<KitchenProxyService>(KitchenProxyService);
    configService = module.get<ConfigService>(ConfigService);
    httpService = module.get<HttpService>(HttpService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
    expect(configService.get).toHaveBeenCalled();
  });

  describe('sendItemsToCook', () => {
    it('should return the new preparations from given orderingLine', async () => {
      const mockedPreparationsResult: PreparationDto[] = mockPreparations(true);
      jest.spyOn(httpService, 'post').mockImplementationOnce(() => of(postSendItemsToCookAxiosResponse(mockedPreparationsResult)));

      const preparationDtos = await service.sendItemsToCook(mockTableNumbers, mockOrderingLines);
      expect(preparationDtos).toEqual(mockedPreparationsResult);
    });
  });
});
