import { Test, TestingModule } from '@nestjs/testing';
import { getModelToken } from '@nestjs/mongoose';
import { Model } from 'mongoose';

import { TablesService } from './tables.service';
import { Table } from '../schemas/table.schema';

import { AddTableDto } from '../dto/add-table.dto';

import { TableNumberNotFoundException } from '../exceptions/table-number-not-found.exception';
import { TableAlreadyExistsException } from '../exceptions/table-already-exists.exception';
import { TableAlreadyTakenException } from '../exceptions/table-already-taken.exception';
import { TableAlreadyFreeException } from '../exceptions/table-already-free.exception';

describe('TablesService', () => {
  let service: TablesService;
  let model: Model<Table>;

  let addTableDto: AddTableDto;
  let mockTable;
  let mockTakenTable;
  let mockTableList;

  beforeEach(async () => {
    addTableDto = {
      number: 12,
    };

    mockTable = {
      _id: 'table id',
      number: 12,
      taken: false,
    };

    mockTakenTable = {
      ...mockTable,
      taken: true,
    };

    mockTableList = [
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
            findByIdAndUpdate: jest.fn(),
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

  describe('findAll', () => {
    it('should return all tables', async () => {
      jest.spyOn(model, 'find').mockReturnValue({
        lean: jest.fn().mockResolvedValueOnce(mockTableList),
      } as any);
      const tables = await service.findAll();
      expect(tables).toEqual(mockTableList);
    });
  });

  describe('findByNumber', () => {
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
  });

  describe('create', () => {
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

  describe('takeTable', () => {
    it('should take the table', async () => {
      jest.spyOn(service, 'findByNumber').mockImplementationOnce(() =>
        Promise.resolve(mockTable),
      );
      jest.spyOn(model, 'findByIdAndUpdate').mockResolvedValueOnce(mockTakenTable);

      const takenTable = await service.takeTable(mockTable.number);
      expect(takenTable).toEqual(mockTakenTable);
    });

    it('should return TableAlreadyTakenException if table is already taken', async () => {
      jest.spyOn(service, 'findByNumber').mockImplementationOnce(() =>
        Promise.resolve(mockTakenTable),
      );

      const testTakeTable = async () => {
        await service.takeTable(mockTakenTable.number);
      };
      await expect(testTakeTable).rejects.toThrow(TableAlreadyTakenException);
    });
  });

  describe('releaseTable', () => {
    it('should release the table', async () => {
      jest.spyOn(service, 'findByNumber').mockImplementationOnce(() =>
        Promise.resolve(mockTakenTable),
      );
      jest.spyOn(model, 'findByIdAndUpdate').mockResolvedValueOnce(mockTable);

      const releasedTable = await service.releaseTable(mockTakenTable.number);
      expect(releasedTable).toEqual(mockTable);
    });

    it('should return TableAlreadyFreeException if table is already free', async () => {
      jest.spyOn(service, 'findByNumber').mockImplementationOnce(() =>
        Promise.resolve(mockTable),
      );

      const testReleaseTable = async () => {
        await service.releaseTable(mockTable.number);
      };
      await expect(testReleaseTable).rejects.toThrow(TableAlreadyFreeException);
    });
  });
});
