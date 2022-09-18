import { Test, TestingModule } from '@nestjs/testing';

import { TableOrdersController } from './table-orders.controller';
import { TableOrdersService } from '../services/table-orders.service';

import { StartOrderingDto } from '../dto/start-ordering.dto';
import { AddMenuItemDto } from '../dto/add-menu-item.dto';
import { PreparationDto } from '../dto/preparation.dto';
import { PreparedItemDto } from '../dto/prepared-item.dto';
import { GetTableOrderParams } from '../params/get-table-order.params';

import { TableOrder } from '../schemas/table-order.schema';
import { OrderingLine } from '../schemas/ordering-line.schema';
import { OrderingItem } from '../schemas/ordering-item.schema';

describe('TableOrdersController', () => {
  let controller: TableOrdersController;
  let service: TableOrdersService;

  let mockTableOrdersList: TableOrder[];
  let mockTableOrder: TableOrder;
  let mockOrderingItemList: OrderingItem[];
  let mockOrderingLineList: OrderingLine[];
  let buildMockTableOrder: Function;
  let mockGetTableOrderParams: GetTableOrderParams;
  let startOrderingDto: StartOrderingDto;
  let addMenuItemDto: AddMenuItemDto;
  let mockPreparedItems: PreparedItemDto[];
  let mockPreparations: PreparationDto[];

  beforeEach(async () => {
    mockTableOrdersList = [
      {
        _id: 'table order 1',
        tableNumber: 1,
        customersCount: 1,
        opened: null,
        lines: [],
        billed: null,
      },
      {
        _id: 'table order 2',
        tableNumber: 2,
        customersCount: 2,
        opened: null,
        lines: [],
        billed: null,
      },
      {
        _id: 'table order 3',
        tableNumber: 3,
        customersCount: 3,
        opened: null,
        lines: [],
        billed: null,
      },
    ];

    mockTableOrder = {
      _id: 'table order id',
      tableNumber: 12,
      customersCount: 42,
      opened: null,
      lines: [],
      billed: null,
    };

    mockOrderingItemList = [
      {
        _id: 'menu item id 1',
        shortName: 'menu item shortname 1',
      },
      {
        _id: 'menu item id 2',
        shortName: 'menu item shortname 2',
      },
      {
        _id: 'menu item id 3',
        shortName: 'menu item shortname 3',
      },
    ];

    mockOrderingLineList = [
      {
        item: mockOrderingItemList[0],
        howMany: 1,
        sentForPreparation: false,
      },
      {
        item: mockOrderingItemList[1],
        howMany: 2,
        sentForPreparation: false,
      },
    ];

    buildMockTableOrder = (opened = null, lines = [], billed = null) => ({
      ...mockTableOrder,
      opened,
      lines,
      billed,
    });

    mockGetTableOrderParams = {
      tableOrderId: mockTableOrder._id,
    };

    startOrderingDto = {
      tableNumber: 12,
      customersCount: 42,
    };

    addMenuItemDto = {
      menuItemId: 'menu item id',
      menuItemShortName: 'menu item shortname',
      howMany: 42,
    };

    mockPreparedItems = [
      {
        _id: 'prepared item 1',
        shortName: 'menu item shortname',
      },
      {
        _id: 'prepared item 2',
        shortName: 'menu item shortname',
      },
      {
        _id: 'prepared item 3',
        shortName: 'menu item shortname',
      }
    ];

    mockPreparations = [
      {
        _id: 'preparation id 1',
        shouldBeReadyAt: (new Date()).toISOString(),
        preparedItems: [mockPreparedItems[0]],
      },
      {
        _id: 'preparation id 2',
        shouldBeReadyAt: (new Date()).toISOString(),
        preparedItems: [mockPreparedItems[1]],
      },
      {
        _id: 'preparation id 3',
        shouldBeReadyAt: (new Date()).toISOString(),
        preparedItems: [mockPreparedItems[2]],
      }
    ];

    const module: TestingModule = await Test.createTestingModule({
      controllers: [TableOrdersController],
      providers: [
        {
          provide: TableOrdersService,
          useValue: {
            findAll: jest.fn().mockResolvedValue(mockTableOrdersList),
            findOne: jest.fn().mockResolvedValue(mockTableOrder),
            startOrdering: jest.fn(),
            addOrderingLineToTableOrder: jest.fn(),
            sendItemsForPreparation: jest.fn(),
            billOrder: jest.fn(),
          },
        },
      ],
    }).compile();

    controller = module.get<TableOrdersController>(TableOrdersController);
    service = module.get<TableOrdersService>(TableOrdersService);
  });

  describe('listAllTableOrders()', () => {
    it('should return an array of tableOrders', async () => {
      expect(controller.listAllTableOrders()).resolves.toEqual(mockTableOrdersList);
      expect(service.findAll).toHaveBeenCalled();
    });
  });

  describe('getTableOrderById()', () => {
    it('should return the searched tableOrder', async () => {
      expect(controller.getTableOrderById(mockGetTableOrderParams)).resolves.toEqual(mockTableOrder);
      expect(service.findOne).toHaveBeenCalledWith(mockGetTableOrderParams.tableOrderId);
    });
  });

  describe('openTable()', () => {
    it('should start ordering a tableOrder', async () => {
      const mockOpened = new Date();
      const createSpy = jest
        .spyOn(service, 'startOrdering')
        .mockResolvedValueOnce(buildMockTableOrder(mockOpened));

      await controller.openTable(startOrderingDto);
      expect(createSpy).toHaveBeenCalledWith(startOrderingDto);
    });
  });

  describe('addMenuItemToTableOrder()', () => {
    it('should add ordering line to tableOrder', async () => {
      const mockOpened = new Date();
      const createSpy = jest
        .spyOn(service, 'addOrderingLineToTableOrder')
        .mockResolvedValueOnce(buildMockTableOrder(mockOpened, mockOrderingLineList));

      await controller.addMenuItemToTableOrder(mockGetTableOrderParams, addMenuItemDto);
      expect(createSpy).toHaveBeenCalledWith(mockGetTableOrderParams.tableOrderId, addMenuItemDto);
    });
  });

  describe('prepareTableOrder()', () => {
    it('should send items for preparation from tableOrder', async () => {
      const createSpy = jest
        .spyOn(service, 'sendItemsForPreparation')
        .mockResolvedValueOnce(mockPreparations);

      await controller.prepareTableOrder(mockGetTableOrderParams);
      expect(createSpy).toHaveBeenCalledWith(mockGetTableOrderParams.tableOrderId);
    });
  });

  describe('billTableOrder()', () => {
    it('should bill order from tableOrder', async () => {
      const mockOpened = new Date();
      const mockOrderingLines = mockOrderingLineList.map((orderingLine) => ({ ...orderingLine, sentForPreparation: true }))
      const mockBilled = new Date();
      const createSpy = jest
        .spyOn(service, 'billOrder')
        .mockResolvedValueOnce(buildMockTableOrder(mockOpened, mockOrderingLines, mockBilled));

      await controller.billTableOrder(mockGetTableOrderParams);
      expect(createSpy).toHaveBeenCalledWith(mockGetTableOrderParams.tableOrderId);
    });
  });
});
