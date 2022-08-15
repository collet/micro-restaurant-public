import { Test, TestingModule } from '@nestjs/testing';

import { TablesController } from './tables.controller';
import { TablesService } from '../services/tables.service';

import { AddTableDto } from '../dto/add-table.dto';
import { GetTableParams } from '../params/get-table.params';

describe('TablesController', () => {
  let controller: TablesController;
  let service: TablesService;

  const addTableDto: AddTableDto = {
    number: 12,
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

  const mockTable = {
    _id: 'table id',
    number: 12,
    taken: false,
  };

  const mockGetTableParams: GetTableParams = {
    tableNumber: mockTable.number,
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [TablesController],
      providers: [
        {
          provide: TablesService,
          useValue: {
            findAll: jest.fn().mockResolvedValue(mockTableList),
            findByNumber: jest.fn().mockResolvedValue(mockTable),
            create: jest.fn().mockResolvedValue(addTableDto),
          },
        },
      ],
    }).compile();

    controller = module.get<TablesController>(TablesController);
    service = module.get<TablesService>(TablesService);
  });

  describe('listAllTables()', () => {
    it('should return an array of tables', async () => {
      expect(controller.listAllTables()).resolves.toEqual(mockTableList);
      expect(service.findAll).toHaveBeenCalled();
    });
  });

  describe('getTableByNumber()', () => {
    it('should return the searched table', async () => {
      expect(controller.getTableByNumber(mockGetTableParams)).resolves.toEqual(mockTable);
      expect(service.findByNumber).toHaveBeenCalledWith(mockGetTableParams.tableNumber);
    });
  });

  describe('addTable()', () => {
    it('should create a table', async () => {
      const createSpy = jest
        .spyOn(service, 'create')
        .mockResolvedValueOnce(mockTable);

      await controller.addTable(addTableDto);
      expect(createSpy).toHaveBeenCalledWith(addTableDto);
    });
  });
});
