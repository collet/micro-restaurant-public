import * as request from 'supertest';
import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';

import appConfig from '../src/shared/config/app.config';
import mongodbConfig from '../src/shared/config/mongodb.config';
import swaggeruiConfig from '../src/shared/config/swaggerui.config';

import { MongooseConfigService } from '../src/shared/services/mongoose-config.service';

import dependenciesConfig from '../src/shared/config/dependencies.config';

import { PostEnum } from '../src/shared/schemas/post-enum.schema';
import { PreparationsModule } from '../src/preparations/preparations.module';
import { PreparationsService } from '../src/preparations/services/preparations.service';

describe('PreparationsController (e2e)', () => {
  let app: INestApplication;

  let mockedRecipes;
  let mockPreparedItemsList;
  let mockPreparationsList;

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
      shouldStartAt: (new Date()).toISOString(),
      startedAt: null,
      finishedAt: null,
    },
    {
      _id: 'prepared item 2',
      shortName: 'menu item shortname 1',
      recipe: mockedRecipes[0],
      shouldStartAt: (new Date()).toISOString(),
      startedAt: null,
      finishedAt: null,
    },
    {
      _id: 'prepared item 3',
      shortName: 'menu item shortname 3',
      recipe: mockedRecipes[1],
      shouldStartAt: (new Date()).toISOString(),
      startedAt: null,
      finishedAt: null,
    },
    {
      _id: 'prepared item 4',
      shortName: 'menu item shortname 4',
      recipe: mockedRecipes[2],
      shouldStartAt: (new Date()).toISOString(),
      startedAt: null,
      finishedAt: null,
    },
    {
      _id: 'prepared item 5',
      shortName: 'menu item shortname 4',
      recipe: mockedRecipes[2],
      shouldStartAt: (new Date()).toISOString(),
      startedAt: null,
      finishedAt: null,
    },
    {
      _id: 'prepared item 6',
      shortName: 'menu item shortname 4',
      recipe: mockedRecipes[2],
      shouldStartAt: (new Date()).toISOString(),
      startedAt: null,
      finishedAt: null,
    },
  ];

  mockPreparationsList = [
    {
      _id: 'preparation 1',
      tableNumber: 1,
      shouldBeReadyAt: (new Date()).toISOString(),
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
      shouldBeReadyAt: (new Date()).toISOString(),
      completedAt: null,
      takenForServiceAt: null,
      preparedItems: [
        mockPreparedItemsList[2],
      ],
    },
    {
      _id: 'preparation 3',
      tableNumber: 1,
      shouldBeReadyAt: (new Date()).toISOString(),
      completedAt: null,
      takenForServiceAt: null,
      preparedItems: [
        mockPreparedItemsList[3],
        mockPreparedItemsList[4],
        mockPreparedItemsList[5],
      ],
    },
  ];

  const preparationsService = {
    findByStateAndTableNumber: () => mockPreparationsList,
    cookItems: () => mockPreparationsList,
    findPreparationById: () => mockPreparationsList[0],
    isTakenForService: () => mockPreparationsList[0],
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
        PreparationsModule
      ],
    })
      .overrideProvider(PreparationsService)
      .useValue(preparationsService)
      .compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  it('/preparations (GET)', () => {
    return request(app.getHttpServer())
      .get('/preparations?state=preparationStarted')
      .expect(200)
      .expect(preparationsService.findByStateAndTableNumber());
  });

  it('/preparations (POST)', () => {
    return request(app.getHttpServer())
      .post('/preparations')
      .send({
        tableNumber: 4,
        itemsToBeCooked: [
          {
            menuItemShortName: 'menu item shortname 1',
            howMany: 2,
          },
          {
            menuItemShortName: 'menu item shortname 2',
            howMany: 3,
          },
        ],
      })
      .set('Accept', 'application/json')
      .expect(201)
      .expect(preparationsService.cookItems());
  });

  it('/preparations/1 (GET)', () => {
    return request(app.getHttpServer())
      .get('/preparations/1')
      .expect(200)
      .expect(preparationsService.findPreparationById());
  });

  it('/preparations/1 (POST)', () => {
    return request(app.getHttpServer())
      .post('/preparations/1/takenToTable')
      .send()
      .set('Accept', 'application/json')
      .expect(200)
      .expect(preparationsService.isTakenForService());
  });

  afterAll(async () => {
    await app.close();
  });
});
