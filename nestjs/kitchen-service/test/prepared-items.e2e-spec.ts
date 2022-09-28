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

import { PreparedItemsModule } from '../src/preparedItems/prepared-items.module';
import { PreparedItemsService } from '../src/preparedItems/services/prepared-items.service';

describe('PreparedItemsController (e2e)', () => {
  let app: INestApplication;

  let mockedRecipes;
  let mockPreparedItemsList;

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

  const preparedItemsService = {
    findPreparedItemById: () => mockPreparedItemsList[0],
    getAllItemsToStartCookingNow: () => mockPreparedItemsList,
    startCookingItem: () => mockPreparedItemsList[0],
    finishCookingItem: () => mockPreparedItemsList[0],
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
        PreparedItemsModule
      ],
    })
      .overrideProvider(PreparedItemsService)
      .useValue(preparedItemsService)
      .compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  it('/preparedItems/1 (GET)', () => {
    return request(app.getHttpServer())
      .get('/preparedItems/1')
      .expect(200)
      .expect(preparedItemsService.findPreparedItemById());
  });

  it('/preparedItems/1/recipe (GET)', () => {
    return request(app.getHttpServer())
      .get('/preparedItems/1/recipe')
      .expect(200)
      .expect(preparedItemsService.findPreparedItemById().recipe);
  });

  it('/preparedItems (GET)', () => {
    return request(app.getHttpServer())
      .get('/preparedItems?post=BAR')
      .expect(200)
      .expect(preparedItemsService.getAllItemsToStartCookingNow());
  });

  it('/preparedItems/1/start (POST)', () => {
    return request(app.getHttpServer())
      .post('/preparedItems/1/start')
      .send()
      .set('Accept', 'application/json')
      .expect(200)
      .expect(preparedItemsService.startCookingItem());
  });

  it('/preparedItems/1/finish (POST)', () => {
    return request(app.getHttpServer())
      .post('/preparedItems/1/finish')
      .send()
      .set('Accept', 'application/json')
      .expect(200)
      .expect(preparedItemsService.finishCookingItem());
  });

  afterAll(async () => {
    await app.close();
  });
});
