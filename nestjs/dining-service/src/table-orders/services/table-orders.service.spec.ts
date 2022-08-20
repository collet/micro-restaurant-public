import { Test, TestingModule } from '@nestjs/testing';
import { getModelToken } from '@nestjs/mongoose';
import { Model } from 'mongoose';

import { TableOrdersService } from './table-orders.service';
import { MenuProxyService } from './menu-proxy.service';
import { KitchenProxyService } from './kitchen-proxy.service';
import { TablesService } from '../../tables/services/tables.service';

import { TableOrder } from '../schemas/table-order.schema';
import { OrderingItem } from '../schemas/ordering-item.schema';
import { OrderingLine } from '../schemas/ordering-line.schema';
import { Table } from '../../tables/schemas/table.schema';

import { StartOrderingDto } from '../dto/start-ordering.dto';
import { AddMenuItemDto } from '../dto/add-menu-item.dto';
import { CookedItemDto } from '../dto/cooked-item.dto';

import { GetTableOrderParams } from '../params/get-table-order.params';

import { TableOrderIdNotFoundException } from '../exceptions/table-order-id-not-found.exception';
import { AddMenuItemDtoNotFoundException } from '../exceptions/add-menu-item-dto-not-found.exception';
import { TableOrderAlreadyBilledException } from '../exceptions/table-order-already-billed.exception';

describe('TableOrdersService', () => {
  let service: TableOrdersService;
  let model: Model<TableOrder>;
  let tablesService: TablesService;
  let menuProxyService: MenuProxyService;
  let kitchenProxyService: KitchenProxyService;

  let mockTableOrdersList: TableOrder[];
  let mockTableOrder: TableOrder;
  let mockOrderingItemList: OrderingItem[];
  let mockOrderingLineList: OrderingLine[];
  let mockOrderingLineSentForPrepationList: OrderingLine[];
  let buildMockTableOrder: Function;
  let mockGetTableOrderParams: GetTableOrderParams;
  let startOrderingDto: StartOrderingDto;
  let addMenuItemDto: AddMenuItemDto;
  let mockCookedItems: CookedItemDto[];

  let mockTableList: Table[];
  let mockTable: Table;
  let mockTakenTable: Table;

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

    mockOrderingLineSentForPrepationList = [
      {
        item: mockOrderingItemList[0],
        howMany: 1,
        sentForPreparation: true,
      },
      {
        item: mockOrderingItemList[1],
        howMany: 2,
        sentForPreparation: true,
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
      menuItemId: mockOrderingItemList[0]._id,
      menuItemShortName: mockOrderingItemList[0].shortName,
      howMany: 42,
    };

    mockTableList = [
      {
        _id: 'table 1',
        number: 1,
        taken: false,
      },
      {
        _id: 'table 2',
        number: 2,
        taken: false,
      },
      {
        _id: 'table 3',
        number: 3,
        taken: false,
      },
    ];

    mockTable = {
      _id: 'table id',
      number: 12,
      taken: false,
    };

    mockTakenTable = {
      ...mockTable,
      taken: true,
    };

    mockCookedItems = [
      {
        _id: 'cooked item id 1',
        readyToServe: (new Date()).toISOString(),
      },
      {
        _id: 'cooked item id 2',
        readyToServe: (new Date()).toISOString(),
      },
      {
        _id: 'cooked item id 3',
        readyToServe: (new Date()).toISOString(),
      }
    ];

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TableOrdersService,
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
        {
          provide: TablesService,
          useValue: {
            findAll: jest.fn().mockResolvedValue(mockTableList),
            findByNumber: jest.fn().mockResolvedValue(mockTable),
            create: jest.fn(),
            takeTable: jest.fn(),
            releaseTable: jest.fn(),
          },
        },
        {
          provide: MenuProxyService,
          useValue: {
            findByShortName: jest.fn(),
          },
        },
        {
          provide: KitchenProxyService,
          useValue: {
            sendItemsToCook: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<TableOrdersService>(TableOrdersService);
    model = module.get<Model<TableOrder>>(getModelToken('TableOrder'));
    tablesService = module.get<TablesService>(TablesService);
    menuProxyService = module.get<MenuProxyService>(MenuProxyService);
    kitchenProxyService = module.get<KitchenProxyService>(KitchenProxyService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('findAll', () => {
    it('should return all tableOrders', async () => {
      jest.spyOn(model, 'find').mockReturnValue({
        lean: jest.fn().mockResolvedValueOnce(mockTableOrdersList),
      } as any);
      const tableOrders = await service.findAll();
      expect(tableOrders).toEqual(mockTableOrdersList);
    });
  });

  describe('findOne', () => {
    it('should return the searched tableOrder', async () => {
      jest.spyOn(model, 'findOne').mockReturnValue({
        lean: jest.fn().mockResolvedValueOnce(mockTableOrder),
      } as any);
      const tableOrder = await service.findOne('table order id');
      expect(tableOrder).toEqual(mockTableOrder);
    });

    it('should return TableOrderIdNotFoundException if the searched tableOrder is not found', async () => {
      jest.spyOn(model, 'findOne').mockReturnValue({
        lean: jest.fn().mockResolvedValueOnce(null),
      } as any);
      const testFindOne = async () => {
        await service.findOne('table order id');
      };
      await expect(testFindOne).rejects.toThrow(TableOrderIdNotFoundException);
    });
  });

  describe('startOrdering', () => {
    it('should create a new tableOrder', async () => {
      jest.spyOn(tablesService, 'takeTable').mockImplementationOnce(() =>
        Promise.resolve(mockTakenTable),
      );
      const mockOpened = new Date();
      const mockNewTableOrder = buildMockTableOrder(mockOpened);
      jest.spyOn(model, 'create').mockImplementationOnce(() =>
        Promise.resolve(mockNewTableOrder),
      );
      const newTableOrder = await service.startOrdering(startOrderingDto);
      expect(newTableOrder).toEqual(mockNewTableOrder);
    });
  });

  describe('addOrderingLineToTableOrder', () => {
    it('should add items as orderingLine to the tableOrder', async () => {
      const mockOpened = new Date();
      const mockOpenedTableOrder = buildMockTableOrder(mockOpened);
      jest.spyOn(service, 'findOne').mockImplementationOnce(() =>
        Promise.resolve(mockOpenedTableOrder),
      );
      jest.spyOn(menuProxyService, 'findByShortName').mockImplementationOnce(() =>
        Promise.resolve(mockOrderingItemList[0]),
      );
      const mockOpenedTableOrderWithLines = buildMockTableOrder(mockOpened, mockOrderingLineList);
      jest.spyOn(model, 'findByIdAndUpdate').mockResolvedValueOnce(mockOpenedTableOrderWithLines);

      const updatedTableOrder = await service.addOrderingLineToTableOrder(mockOpenedTableOrder._id, addMenuItemDto);
      expect(updatedTableOrder).toEqual(mockOpenedTableOrderWithLines);
    });

    it('should return AddMenuItemDtoNotFoundException if menu item in param is not found', async () => {
      const mockOpened = new Date();
      const mockOpenedTableOrder = buildMockTableOrder(mockOpened);
      jest.spyOn(service, 'findOne').mockImplementationOnce(() =>
        Promise.resolve(mockOpenedTableOrder),
      );
      jest.spyOn(menuProxyService, 'findByShortName').mockImplementationOnce(() =>
        Promise.resolve(null),
      );

      const testAddOrderingLineToTableOrder = async () => {
        await service.addOrderingLineToTableOrder(mockOpenedTableOrder._id, addMenuItemDto);
      };
      await expect(testAddOrderingLineToTableOrder).rejects.toThrow(AddMenuItemDtoNotFoundException);
    });

    it('should return AddMenuItemDtoNotFoundException if menu item id in param is not the same as the found one', async () => {
      const mockOpened = new Date();
      const mockOpenedTableOrder = buildMockTableOrder(mockOpened);
      jest.spyOn(service, 'findOne').mockImplementationOnce(() =>
        Promise.resolve(mockOpenedTableOrder),
      );
      jest.spyOn(menuProxyService, 'findByShortName').mockImplementationOnce(() =>
        Promise.resolve(mockOrderingItemList[1]),
      );

      const testAddOrderingLineToTableOrder = async () => {
        await service.addOrderingLineToTableOrder(mockOpenedTableOrder._id, addMenuItemDto);
      };
      await expect(testAddOrderingLineToTableOrder).rejects.toThrow(AddMenuItemDtoNotFoundException);
    });

    it('should return TableOrderAlreadyBilledException if tableOrder is already billed', async () => {
      const mockOpened = new Date();
      const mockBilled = new Date();
      const mockBilledTableOrder = buildMockTableOrder(mockOpened, [], mockBilled);
      jest.spyOn(service, 'findOne').mockImplementationOnce(() =>
        Promise.resolve(mockBilledTableOrder),
      );

      const testAddOrderingLineToTableOrder = async () => {
        await service.addOrderingLineToTableOrder(mockBilledTableOrder._id, addMenuItemDto);
      };
      await expect(testAddOrderingLineToTableOrder).rejects.toThrow(TableOrderAlreadyBilledException);
    });
  });

  describe('manageOrderingLine', () => {
    it('should return ordering line with cooked items', async () => {
      const mockedOrderingLine = mockOrderingLineList[0];
      const mockedOrderingLineSentForPrepationList = mockOrderingLineSentForPrepationList[0];

      jest.spyOn(kitchenProxyService, 'sendItemsToCook').mockImplementationOnce(() =>
        Promise.resolve(mockCookedItems),
      );

      const orderingLineWithCookedItems = await service.manageOrderingLine(mockedOrderingLine);
      expect(orderingLineWithCookedItems.orderingLine).toEqual(mockedOrderingLineSentForPrepationList);
      expect(orderingLineWithCookedItems.cookedItems).toEqual(mockCookedItems);
    })

    it('should return ordering line with empty cooked items', async () => {
      const mockedOrderingLineSentForPrepationList = mockOrderingLineSentForPrepationList[0];

      jest.spyOn(kitchenProxyService, 'sendItemsToCook').mockImplementationOnce(() =>
        Promise.resolve(mockCookedItems),
      );

      const orderingLineWithCookedItems = await service.manageOrderingLine(mockedOrderingLineSentForPrepationList);
      expect(orderingLineWithCookedItems.orderingLine).toEqual(mockedOrderingLineSentForPrepationList);
      expect(orderingLineWithCookedItems.cookedItems).toEqual([]);
    })
  });

  describe('sendItemsForPreparation', () => {
    it('should send items from tableOrder to preparation', async () => {
      const mockOpened = new Date();
      const mockOpenedTableOrderWithLines = buildMockTableOrder(mockOpened, mockOrderingLineList);
      jest.spyOn(service, 'findOne').mockImplementationOnce(() =>
        Promise.resolve(mockOpenedTableOrderWithLines),
      );
      let mockCookedItemsIndex = -1;
      jest.spyOn(service, 'manageOrderingLine').mockImplementation((orderingLine) => {
        const cookedItems = [];
        for (let i = 0; i < orderingLine.howMany; i += 1) {
          mockCookedItemsIndex += 1;
          cookedItems.push(mockCookedItems[mockCookedItemsIndex]);
        }
        return Promise.resolve({ orderingLine, cookedItems });
      });

      const mockUpdatedTableOrderWithLines = buildMockTableOrder(mockOpened, mockOrderingLineSentForPrepationList);
      jest.spyOn(model, 'findByIdAndUpdate').mockResolvedValueOnce(mockUpdatedTableOrderWithLines);

      const newCookedItems = await service.sendItemsForPreparation(mockOpenedTableOrderWithLines._id);
      expect(newCookedItems).toEqual(mockCookedItems);
    });

    it('should return TableOrderAlreadyBilledException if tableOrder is already billed', async () => {
      const mockOpened = new Date();
      const mockBilled = new Date();
      const mockBilledTableOrder = buildMockTableOrder(mockOpened, [], mockBilled);
      jest.spyOn(service, 'findOne').mockImplementationOnce(() =>
        Promise.resolve(mockBilledTableOrder),
      );

      const testSendItemsForPreparation = async () => {
        await service.sendItemsForPreparation(mockBilledTableOrder._id);
      };
      await expect(testSendItemsForPreparation).rejects.toThrow(TableOrderAlreadyBilledException);
    });
  });

  describe('billOrder', () => {
    it('should bill order of tableOrder', async () => {
      const mockOpened = new Date();
      const mockOpenedTableOrder = buildMockTableOrder(mockOpened);
      jest.spyOn(service, 'findOne').mockImplementationOnce(() =>
        Promise.resolve(mockOpenedTableOrder),
      );
      jest.spyOn(tablesService, 'releaseTable').mockImplementationOnce(() =>
        Promise.resolve(mockTable),
      );
      const mockBilled = new Date();
      const mockBilledTableOrder = buildMockTableOrder(mockOpened, [], mockBilled);
      jest.spyOn(model, 'findByIdAndUpdate').mockResolvedValueOnce(mockBilledTableOrder);

      const updatedTableOrder = await service.billOrder(mockOpenedTableOrder._id);
      expect(updatedTableOrder).toEqual(mockBilledTableOrder);
    });

    it('should return TableOrderAlreadyBilledException if tableOrder is already billed', async () => {
      const mockOpened = new Date();
      const mockBilled = new Date();
      const mockBilledTableOrder = buildMockTableOrder(mockOpened, [], mockBilled);
      jest.spyOn(service, 'findOne').mockImplementationOnce(() =>
        Promise.resolve(mockBilledTableOrder),
      );

      const testBillOrder = async () => {
        await service.billOrder(mockBilledTableOrder._id);
      };
      await expect(testBillOrder).rejects.toThrow(TableOrderAlreadyBilledException);
    });
  });
});
