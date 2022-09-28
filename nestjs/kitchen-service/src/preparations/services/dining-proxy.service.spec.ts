import { Test, TestingModule } from '@nestjs/testing';
import { ConfigService } from '@nestjs/config';
import { HttpService } from '@nestjs/axios';
import { of } from 'rxjs';

import { DependenciesConfig } from '../../shared/config/interfaces/dependencies-config.interface';

import { DiningProxyService } from './dining-proxy.service';

import { Table } from '../schemas/table.schema';

describe('DiningProxyService', () => {
  let service: DiningProxyService;
  let configService: ConfigService;
  let httpService: HttpService;

  let now: Date;
  let mockDependenciesConfig: DependenciesConfig;

  let mockTableList: Table[];
  let mockTableNumber;
  let getRetrieveAllTablesAxiosResponse: Function;

  beforeEach(async () => {
    now = new Date();

    mockDependenciesConfig = {
      dining_service_url_with_port: 'dining_service_url:port',
    };

    mockTableList = [
      {
        _id: '1',
        number: 1,
      },
      {
        _id: '2',
        number: 2,
      },
      {
        _id: '3',
        number: 3,
      },
    ];

    mockTableNumber = 1;

    getRetrieveAllTablesAxiosResponse = (data) => ({
      data,
      headers: {},
      config: { url: `http://${mockDependenciesConfig.dining_service_url_with_port}/tables` },
      status: 200,
      statusText: 'OK',
    });


    const module: TestingModule = await Test.createTestingModule({
      providers: [
        DiningProxyService,
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

    service = module.get<DiningProxyService>(DiningProxyService);
    configService = module.get<ConfigService>(ConfigService);
    httpService = module.get<HttpService>(HttpService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
    expect(configService.get).toHaveBeenCalled();
  });

  describe('isTableNumberValid', () => {
    it('should return that table in params is valid', async () => {
      jest.spyOn(httpService, 'get').mockImplementationOnce(() => of(getRetrieveAllTablesAxiosResponse(mockTableList)));

      const tableIsValid = await service.isTableNumberValid(mockTableNumber);
      expect(tableIsValid).toBeTruthy();
    });

    it('should return that table in params is not valid', async () => {
      jest.spyOn(httpService, 'get').mockImplementationOnce(() => of(getRetrieveAllTablesAxiosResponse(mockTableList)));

      const tableIsValid = await service.isTableNumberValid(4000);
      expect(tableIsValid).toBeFalsy();
    });
  });
});
