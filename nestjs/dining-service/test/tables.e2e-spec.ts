import * as request from 'supertest';
import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';

import appConfig from '../src/shared/config/app.config';
import mongodbConfig from '../src/shared/config/mongodb.config';
import swaggeruiConfig from '../src/shared/config/swaggerui.config';

import { MongooseConfigService } from '../src/shared/services/mongoose-config.service';

import { TablesModule } from '../src/tables/tables.module';
import { TablesService } from '../src/tables/services/tables.service';
import dependenciesConfig from '../src/shared/config/dependencies.config';

describe('TablesController (e2e)', () => {
  let app: INestApplication;

  const mockTableList = [
    {
      number: 1,
    },
    {
      number: 2,
    },
    {
      number: 3,
    },
  ];

  const tablesService = {
    findAll: () => mockTableList,
    findByNumber: () => mockTableList[0],
    create: () => ({
      number: 4,
    }),
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
        TablesModule
      ],
    })
      .overrideProvider(TablesService)
      .useValue(tablesService)
      .compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  it('/tables (GET)', () => {
    return request(app.getHttpServer())
      .get('/tables')
      .expect(200)
      .expect(tablesService.findAll());
  });

  it('/tables/1 (GET)', () => {
    return request(app.getHttpServer())
      .get('/tables/1')
      .expect(200)
      .expect(tablesService.findByNumber());
  });

  it('/tables (POST)', () => {
    return request(app.getHttpServer())
      .post('/tables')
      .send({
        number: 4,
      })
      .set('Accept', 'application/json')
      .expect(201)
      .expect(tablesService.create());
  });

  afterAll(async () => {
    await app.close();
  });
});
