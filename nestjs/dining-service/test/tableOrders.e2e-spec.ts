import * as request from 'supertest';
import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';

import appConfig from '../src/shared/config/app.config';
import mongodbConfig from '../src/shared/config/mongodb.config';
import swaggeruiConfig from '../src/shared/config/swaggerui.config';
import dependenciesConfig from '../src/shared/config/dependencies.config';

import { MongooseConfigService } from '../src/shared/services/mongoose-config.service';

import { TableOrdersModule } from '../src/table-orders/table-orders.module';
import { TablesModule } from '../src/tables/tables.module';

import { TableOrdersService } from '../src/table-orders/services/table-orders.service';
import { PreparationDto } from '../src/table-orders/dto/cooked-item.dto';

describe('TableOrdersController (e2e)', () => {
  let app: INestApplication;

  let mockTableOrdersList = [
    {
      _id: 'table order 1',
      tableNumber: 1,
      customersCount: 1,
      opened: null,
      lines: [],
      billed: null,
    },
    {
      _id: 'table order 2',
      tableNumber: 2,
      customersCount: 2,
      opened: null,
      lines: [],
      billed: null,
    },
    {
      _id: 'table order 3',
      tableNumber: 3,
      customersCount: 3,
      opened: null,
      lines: [],
      billed: null,
    },
  ];

  const mockTableOrder = {
    _id: 'table order id',
    tableNumber: 12,
    customersCount: 42,
    opened: null,
    lines: [],
    billed: null,
  };

  const mockOrderingItemList = [
    {
      _id: 'menu item id 1',
      shortName: 'menu item shortname 1',
    },
    {
      _id: 'menu item id 2',
      shortName: 'menu item shortname 2',
    },
    {
      _id: 'menu item id 3',
      shortName: 'menu item shortname 3',
    },
  ];

  const mockOrderingLineList = [
    {
      item: mockOrderingItemList[0],
      howMany: 1,
      sentForPreparation: false,
    },
    {
      item: mockOrderingItemList[1],
      howMany: 2,
      sentForPreparation: false,
    },
  ];

  const mockOrderingLineSentForPrepationList = [
    {
      item: mockOrderingItemList[0],
      howMany: 1,
      sentForPreparation: true,
    },
    {
      item: mockOrderingItemList[1],
      howMany: 2,
      sentForPreparation: true,
    },
  ];

  const buildMockTableOrder = (opened = null, lines = [], billed = null) => ({
    ...mockTableOrder,
    opened: opened ? opened.toDateString() : null,
    lines,
    billed: billed ? billed.toDateString() : null,
  });

  const mockCookedItems = [
    {
      _id: 'cooked item id 1',
      readyToServe: (new Date()).toISOString(),
    },
    {
      _id: 'cooked item id 2',
      readyToServe: (new Date()).toISOString(),
    },
    {
      _id: 'cooked item id 3',
      readyToServe: (new Date()).toISOString(),
    }
  ];

  const tableOrdersService = {
    findAll: () => mockTableOrdersList,
    findOne: () => mockTableOrdersList[0],
    startOrdering: () => (buildMockTableOrder(new Date())),
    addOrderingLineToTableOrder: () => (buildMockTableOrder(new Date(), mockOrderingLineList)),
    sendItemsForPreparation: () => (mockCookedItems),
    billOrder: () => (buildMockTableOrder(new Date(), mockOrderingLineList, new Date())),
  };

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [
        ConfigModule.forRoot({
          isGlobal: true,
          load: [appConfig, mongodbConfig, swaggeruiConfig, dependenciesConfig],
        }),
        MongooseModule.forRootAsync({
          useClass: MongooseConfigService,
        }),
        TablesModule,
        TableOrdersModule,
      ],
    })
      .overrideProvider(TableOrdersService)
      .useValue(tableOrdersService)
      .compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  it('/tableOrders (GET)', () => {
    return request(app.getHttpServer())
      .get('/tableOrders')
      .expect(200)
      .expect(tableOrdersService.findAll());
  });

  it('/tableOrders/1 (GET)', () => {
    return request(app.getHttpServer())
      .get('/tableOrders/1')
      .expect(200)
      .expect(tableOrdersService.findOne());
  });

  it('/tableOrders (POST)', () => {
    return request(app.getHttpServer())
      .post('/tableOrders')
      .send({
        tableNumber: 1,
        customersCount: 1,
      })
      .set('Accept', 'application/json')
      .expect(201)
      .expect(tableOrdersService.startOrdering());
  });

  it('/tableOrders/1 (POST)', () => {
    return request(app.getHttpServer())
      .post('/tableOrders/1')
      .send({
        menuItemId: 'menu item id',
        menuItemShortName: 'menu item shortname',
        howMany: 1,
      })
      .set('Accept', 'application/json')
      .expect(201)
      .expect(tableOrdersService.addOrderingLineToTableOrder());
  });

  it('/tableOrders/1/prepare (POST)', () => {
    return request(app.getHttpServer())
      .post('/tableOrders/1/prepare')
      .send()
      .set('Accept', 'application/json')
      .expect(201)
      .expect(tableOrdersService.sendItemsForPreparation());
  });

  it('/tableOrders/1/bill (POST)', () => {
    return request(app.getHttpServer())
      .post('/tableOrders/1/bill')
      .send()
      .set('Accept', 'application/json')
      .expect(200)
      .expect(tableOrdersService.billOrder());
  });

  afterAll(async () => {
    await app.close();
  });
});
