import * as request from 'supertest';
import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';

import appConfig from '../src/shared/config/app.config';
import mongodbConfig from '../src/shared/config/mongodb.config';
import swaggeruiConfig from '../src/shared/config/swaggerui.config';

import { MongooseConfigService } from '../src/shared/services/mongoose-config.service';

import { CookedItemsModule } from '../src/cookedItems/cooked-items.module';

import { CookedItemsService } from '../src/cookedItems/services/cooked-items.service';

import { Recipe } from '../dist/cookedItems/schemas/recipe.schema';

describe('CookedItemsController (e2e)', () => {
  let app: INestApplication;

  let cookedItemsService;

  let now: Date;

  let mockRecipeList: Recipe[];
  let mockCookedItemsList: Function;
  let transformCookedItem: Function;
  let transformCookedItems: Function;

  beforeAll(async () => {
    now = new Date();

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

    mockCookedItemsList = (fillTakenForService = false) => ([
      {
        _id: 'cooked item id 1',
        cookableRecipe: mockRecipeList[0],
        preparationStarted: now.toISOString(),
        readyToServe: (new Date(now.getTime() + mockRecipeList[0].meanCookingTimeInSec * 1000)).toISOString(),
        takenForService: fillTakenForService ? (new Date(now.getTime() + 60 * 1000)).toISOString() : null,
      },
      {
        _id: 'cooked item id 2',
        cookableRecipe: mockRecipeList[1],
        preparationStarted: now.toISOString(),
        readyToServe: (new Date(now.getTime() + mockRecipeList[1].meanCookingTimeInSec * 1000)).toISOString(),
        takenForService: fillTakenForService ? (new Date(now.getTime() + 60 * 1000)).toISOString() : null,
      },
      {
        _id: 'cooked item id 3',
        cookableRecipe: mockRecipeList[2],
        preparationStarted: now.toISOString(),
        readyToServe: (new Date(now.getTime() + mockRecipeList[2].meanCookingTimeInSec * 1000)).toISOString(),
        takenForService: fillTakenForService ? (new Date(now.getTime() + 60 * 1000)).toISOString() : null,
      }
    ]);

    transformCookedItem = (cookedItem) => ({
      _id: cookedItem._id,
      readyToServe: cookedItem.readyToServe,
    });

    transformCookedItems = (cookedItems) => cookedItems.map((cookedItem) => transformCookedItem(cookedItem));

    cookedItemsService = {
      findOne: () => mockCookedItemsList()[0],
      cookItems: () => mockCookedItemsList(),
      findByCookState: () => ([mockCookedItemsList()[0]]),
      isTakenForService: () => (mockCookedItemsList(true)[0]),
    };

    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [
        ConfigModule.forRoot({
          isGlobal: true,
          load: [appConfig, mongodbConfig, swaggeruiConfig],
        }),
        MongooseModule.forRootAsync({
          useClass: MongooseConfigService,
        }),
        CookedItemsModule
      ],
    })
      .overrideProvider(CookedItemsService)
      .useValue(cookedItemsService)
      .compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  it('/cookedItems (POST)', () => {
    return request(app.getHttpServer())
      .post('/cookedItems')
      .send({
        menuItemShortName: 'MI1',
        howMany: 4,
      })
      .set('Accept', 'application/json')
      .expect(201)
      .expect(transformCookedItems(cookedItemsService.cookItems()));
  });

  it('/cookedItems?state=readyToBeServed (GET)', () => {
    return request(app.getHttpServer())
      .get('/cookedItems?state=readyToBeServed')
      .set('Accept', 'application/json')
      .expect(200)
      .expect(transformCookedItems(cookedItemsService.findByCookState()));
  });

  it('/cookedItems/1/takenToTable (POST)', () => {
    return request(app.getHttpServer())
      .post('/cookedItems/1/takenToTable')
      .send()
      .set('Accept', 'application/json')
      .expect(200)
      .expect(transformCookedItem(cookedItemsService.isTakenForService()));
  });

  afterAll(async () => {
    await app.close();
  });
});
