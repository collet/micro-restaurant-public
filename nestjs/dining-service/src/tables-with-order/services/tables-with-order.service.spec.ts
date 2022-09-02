import { Test, TestingModule } from '@nestjs/testing';
import { getModelToken } from '@nestjs/mongoose';
import { Model } from 'mongoose';

import { TablesWithOrderService } from './tables-with-order.service';

import { TableOrder } from '../../table-orders/schemas/table-order.schema';
import { Table } from '../../tables/schemas/table.schema';

import { TableWithOrderDto } from '../dto/table-with-order.dto';

import { TableOrderTableNumberNotFoundException } from '../exceptions/table-order-table-number-not-found.exception';

describe('TablesWithOrderService', () => {
  let service: TablesWithOrderService;
  let model: Model<TableOrder>;

  let mockTableOrder: TableOrder;

  let mockTable: Table;
  let mockTakenTable: Table;

  let mockTableWithoutOrder: TableWithOrderDto;
  let mockTakenTableWithOrder: TableWithOrderDto;
  let mockTakenTableWithoutOrder: TableWithOrderDto;

  beforeEach(async () => {
    mockTableOrder = {
      _id: 'table order id',
      tableNumber: 12,
      customersCount: 42,
      opened: null,
      lines: [],
      billed: null,
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

    mockTableWithoutOrder = {
      ...mockTable,
      tableOrderId: null,
    };

    mockTakenTableWithOrder = {
      ...mockTakenTable,
      tableOrderId: mockTableOrder._id,
    };

    mockTakenTableWithoutOrder = {
      ...mockTakenTable,
      tableOrderId: null,
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TablesWithOrderService,
        {
          provide: getModelToken('TableOrder'),
          useValue: {
            new: jest.fn().mockResolvedValue(mockTableOrder),
            constructor: jest.fn().mockResolvedValue(mockTableOrder),
            find: jest.fn(),
            findOne: jest.fn(),
            create: jest.fn(),
            exec: jest.fn(),
            findByIdAndUpdate: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<TablesWithOrderService>(TablesWithOrderService);
    model = module.get<Model<TableOrder>>(getModelToken('TableOrder'));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('findForTable', () => {
    it('should return the tableOrder linked to tha table number', async () => {
      jest.spyOn(model, 'find').mockReturnValue({
        lean: jest.fn().mockResolvedValueOnce([mockTableOrder]),
      } as any);
      const tableOrder = await service.findForTable(mockTableOrder.tableNumber);
      expect(tableOrder).toEqual(mockTableOrder);
    });

    it('should return TableOrderIdNotFoundException if the searched tableOrder is not found', async () => {
      jest.spyOn(model, 'find').mockReturnValue({
        lean: jest.fn().mockResolvedValueOnce([]),
      } as any);
      const testFindOne = async () => {
        await service.findForTable(mockTableOrder.tableNumber);
      };
      await expect(testFindOne).rejects.toThrow(TableOrderTableNumberNotFoundException);
    });
  });

  describe('tableToTableWithOrder', () => {
    it('should return a TableWithOrder from table when table is not taken', async () => {
      jest.spyOn(service, 'findForTable').mockImplementationOnce(() =>
        Promise.resolve(mockTableOrder),
      );
      const tableWithOrder = await service.tableToTableWithOrder(mockTable);
      expect(tableWithOrder).toEqual(mockTableWithoutOrder);
    });

    it('should return a TableWithOrder from table when table is taken', async () => {
      jest.spyOn(service, 'findForTable').mockImplementationOnce(() =>
        Promise.resolve(mockTableOrder),
      );
      const tableWithOrder = await service.tableToTableWithOrder(mockTakenTable);
      expect(tableWithOrder).toEqual(mockTakenTableWithOrder);
    });

    it('should return a TableWithOrder from table when table is taken but table order not found', async () => {
      jest.spyOn(service, 'findForTable').mockImplementationOnce(() => {
        throw new TableOrderTableNumberNotFoundException(mockTakenTable.number);
      });
      const tableWithOrder = await service.tableToTableWithOrder(mockTakenTable);
      expect(tableWithOrder).toEqual(mockTakenTableWithoutOrder);
    });
  });
});
