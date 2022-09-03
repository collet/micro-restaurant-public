import { Test, TestingModule } from '@nestjs/testing';
import { getConnectionToken } from '@nestjs/mongoose';
import { Connection } from 'mongoose';

import { StartupLogicService } from './startup-logic.service';

import { AddTableDto } from '../../tables/dto/add-table.dto';

describe('StartupLogicService', () => {
  let service: StartupLogicService;
  let connection: Connection;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        StartupLogicService,
        {
          provide: getConnectionToken(),
          useValue: {
            models: {
              Table: {
                find: jest.fn(),
                create: jest.fn(),
              },
            },
          },
        },
      ],
    }).compile();

    service = module.get<StartupLogicService>(StartupLogicService);
    connection = module.get<Connection>(getConnectionToken());
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should return a AddTableDto instance', () => {
    const mockNumber = 8;

    const table: AddTableDto = new AddTableDto();
    table.number = mockNumber;

    const addTable = service.createTable(mockNumber);
    expect(addTable).toEqual(table);
  });

  it('should add a new table', async () => {
    const mockNumber = 8;

    const mockTable = {
      number: mockNumber,
    };

    jest.spyOn(connection.models.Table, 'find').mockResolvedValueOnce([]);
    jest.spyOn(connection.models.Table, 'create').mockImplementationOnce(() =>
      Promise.resolve(mockTable),
    );
    const newTable = await service.addTable(mockNumber);
    expect(newTable).toEqual(mockTable);
  });

  it('should throw an error if table item already exists', async () => {
    const mockNumber = 8;

    const mockTable = {
      number: mockNumber,
    };

    jest.spyOn(connection.models.Table, 'find').mockResolvedValueOnce([mockTable]);

    const testAddTable = async () => {
      await service.addTable(mockNumber);
    };
    await expect(testAddTable).rejects.toThrow();
  });

  it ('should seed the db with some tables', async () => {
    service.addTable = jest.fn();
    await service.onApplicationBootstrap();

    expect(service.addTable).toHaveBeenCalledTimes(15);
  });
});
