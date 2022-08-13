import * as request from 'supertest';
import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';

import appConfig from '../src/shared/config/app.config';
import mongodbConfig from '../src/shared/config/mongodb.config';
import swaggeruiConfig from '../src/shared/config/swaggerui.config';

import { MongooseConfigService } from '../src/shared/services/mongoose-config.service';

import { MenusModule } from '../src/menus/menus.module';
import { MenusService } from '../src/menus/services/menus.service';

describe('MenusController (e2e)', () => {
  let app: INestApplication;

  const mockMenuItemList = [
    {
      fullName: 'MenuItem #1',
      shortName: 'MI1',
      price: 1,
    },
    {
      fullName: 'MenuItem #2',
      shortName: 'MI2',
      price: 2,
    },
    {
      fullName: 'MenuItem #3',
      shortName: 'MI3',
      price: 3,
    },
  ];

  const menusService = {
    findAll: () => mockMenuItemList,
    findOne: () => mockMenuItemList[0],
    create: () => ({
      fullName: 'MenuItem #4',
      shortName: 'MI4',
      price: 4,
    }),
  };

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [
        ConfigModule.forRoot({
          isGlobal: true,
          load: [appConfig, mongodbConfig, swaggeruiConfig],
        }),
        MongooseModule.forRootAsync({
          useClass: MongooseConfigService,
        }),
        MenusModule
      ],
    })
      .overrideProvider(MenusService)
      .useValue(menusService)
      .compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  it('/menus (GET)', () => {
    return request(app.getHttpServer())
      .get('/menus')
      .expect(200)
      .expect(menusService.findAll());
  });

  it('/menus/itemId1 (GET)', () => {
    return request(app.getHttpServer())
      .get('/menus/itemId1')
      .expect(200)
      .expect(menusService.findOne());
  });

  it('/menus (POST)', () => {
    return request(app.getHttpServer())
      .post('/menus')
      .send({
        fullName: 'MenuItem #4',
        shortName: 'MI4',
        price: 4,
      })
      .set('Accept', 'application/json')
      .expect(201)
      .expect(menusService.create());
  });

  afterAll(async () => {
    await app.close();
  });
});
