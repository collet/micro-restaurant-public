import { Test, TestingModule } from '@nestjs/testing';
import { getModelToken } from '@nestjs/mongoose';
import { Model } from 'mongoose';

import { TablesService } from './tables.service';
import { Table } from '../schemas/table.schema';

import { AddTableDto } from '../dto/add-table.dto';

import { TableNumberNotFoundException } from '../exceptions/table-number-not-found.exception';
import { TableAlreadyExistsException } from '../exceptions/table-already-exists.exception';

describe('TablesService', () => {
  let service: TablesService;
  let model: Model<Table>;

  const addTableDto: AddTableDto = {
    number: 12,
  };

  const mockTable = {
    _id: 'table id',
    number: 12,
    taken: false,
  };

  const mockTableList = [
    {
      number: 1,
      taken: false,
    },
    {
      number: 2,
      taken: false,
    },
    {
      number: 3,
      taken: false,
    },
  ];

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TablesService,
        {
          provide: getModelToken('Table'),
          useValue: {
            new: jest.fn().mockResolvedValue(mockTable),
            constructor: jest.fn().mockResolvedValue(mockTable),
            find: jest.fn(),
            findOne: jest.fn(),
            create: jest.fn(),
            exec: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<TablesService>(TablesService);
    model = module.get<Model<Table>>(getModelToken('Table'));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should return all tables', async () => {
    jest.spyOn(model, 'find').mockReturnValue({
      lean: jest.fn().mockResolvedValueOnce(mockTableList),
    } as any);
    const tables = await service.findAll();
    expect(tables).toEqual(mockTableList);
  });

  it('should return the searched table', async () => {
    jest.spyOn(model, 'findOne').mockReturnValue({
      lean: jest.fn().mockResolvedValueOnce(mockTable),
    } as any);
    const table = await service.findByNumber(12);
    expect(table).toEqual(mockTable);
  });

  it('should return TableNumberNotFoundException if the searched table is not found', async () => {
    jest.spyOn(model, 'findOne').mockReturnValue({
      lean: jest.fn().mockResolvedValueOnce(null),
    } as any);
    const testFindOne = async () => {
      await service.findByNumber(12);
    };
    await expect(testFindOne).rejects.toThrow(TableNumberNotFoundException);
  });

  it('should insert a new table', async () => {
    jest.spyOn(model, 'find').mockResolvedValueOnce([]);
    jest.spyOn(model, 'create').mockImplementationOnce(() =>
      Promise.resolve(mockTable),
    );
    const newTable = await service.create(addTableDto);
    expect(newTable).toEqual(mockTable);
  });

  it('should return TableAlreadyExistsException if table already exists', async () => {
    jest.spyOn(model, 'find').mockResolvedValueOnce([mockTable]);

    const testCreate = async () => {
      await service.create(addTableDto);
    };
    await expect(testCreate).rejects.toThrow(TableAlreadyExistsException);
  });
});
