import { Test, TestingModule } from '@nestjs/testing';
import { ConfigService } from '@nestjs/config';
import { HttpService } from '@nestjs/axios';
import { AxiosResponse } from 'axios';
import { of } from 'rxjs';

import { DependenciesConfig } from '../../shared/config/interfaces/dependencies-config.interface';

import { MenuItem } from '../schemas/menu-item.schema';

import { MenuProxyService } from './menu-proxy.service';
import { OrderingItem } from '../schemas/ordering-item.schema';

describe('MenuProxyService', () => {
  let service: MenuProxyService;
  let configService: ConfigService;
  let httpService: HttpService;

  let mockDependenciesConfig: DependenciesConfig;
  let mockMenuItemShortName: string;
  let mockUnknownMenuItemShortName: string;
  let mockMenuItem: MenuItem;
  let mockMenuItemList: MenuItem[];
  let getFullMenuAxiosResponse: AxiosResponse<MenuItem[]>;
  let mockOrderingItem: OrderingItem;

  beforeEach(async () => {
    mockDependenciesConfig = {
      menu_service_url_with_port: 'menu_service_url:port',
      kitchen_service_url_with_port: 'kitchen_service_url_with_port:port',
    };

    mockMenuItemShortName = 'MI1';

    mockUnknownMenuItemShortName = 'MI4';

    mockMenuItem = new MenuItem();
    mockMenuItem._id = 'menu item id 1';
    mockMenuItem.fullName = 'MenuItem #1';
    mockMenuItem.shortName = 'MI1';
    mockMenuItem.price = 1;

    mockMenuItemList = [
      mockMenuItem,
      {
        _id: 'menu item id 2',
        fullName: 'MenuItem #2',
        shortName: 'MI2',
        price: 2,
      },
      {
        _id: 'menu item id 3',
        fullName: 'MenuItem #3',
        shortName: 'MI3',
        price: 3,
      },
    ];

    getFullMenuAxiosResponse = {
      data: mockMenuItemList,
      headers: {},
      config: { url: `http://${mockDependenciesConfig.menu_service_url_with_port}/menus` },
      status: 200,
      statusText: 'OK',
    };

    mockOrderingItem = {
      _id: mockMenuItem._id,
      shortName: mockMenuItem.shortName,
    };


    const module: TestingModule = await Test.createTestingModule({
      providers: [
        MenuProxyService,
        {
          provide: ConfigService,
          useValue: {
            get: jest.fn().mockResolvedValue(mockDependenciesConfig),
          },
        },
        {
          provide: HttpService,
          useValue: {
            get: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<MenuProxyService>(MenuProxyService);
    configService = module.get<ConfigService>(ConfigService);
    httpService = module.get<HttpService>(HttpService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
    expect(configService.get).toHaveBeenCalled();
  });

  describe('findByShortName', () => {
    it('should return the right OrderingItem from given menu item shortname', async () => {
      jest.spyOn(httpService, 'get').mockImplementationOnce(() => of(getFullMenuAxiosResponse));

      const orderingItem = await service.findByShortName(mockMenuItemShortName);
      expect(orderingItem).toEqual(mockOrderingItem);
    });

    it('should return null if given menu item shortname is not found', async () => {
      jest.spyOn(httpService, 'get').mockImplementationOnce(() => of(getFullMenuAxiosResponse));

      const orderingItem = await service.findByShortName(mockUnknownMenuItemShortName);
      expect(orderingItem).toBeNull();
    });
  });
});
