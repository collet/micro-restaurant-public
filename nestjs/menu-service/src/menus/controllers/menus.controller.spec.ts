import { Test, TestingModule } from '@nestjs/testing';

import { MenusController } from './menus.controller';
import { MenusService } from '../services/menus.service';

import { AddMenuItemDto } from '../dto/add-menu-item.dto';
import { GetMenuItemParams } from '../params/get-menu-item.params';
import { CategoryEnum } from '../schemas/category-enum.schema';

describe('MenusController', () => {
  let controller: MenusController;
  let service: MenusService;

  const addMenuItemDto: AddMenuItemDto = {
    fullName: 'Delicious Pizza Regina',
    shortName: 'pizza',
    price: 12,
    category: CategoryEnum.MAIN,
  };

  const mockMenuItemList = [
    {
      fullName: 'MenuItem #1',
      shortName: 'MI1',
      price: 1,
      category: CategoryEnum.STARTER,
    },
    {
      fullName: 'MenuItem #2',
      shortName: 'MI2',
      price: 2,
      category: CategoryEnum.DESSERT,
    },
    {
      fullName: 'MenuItem #3',
      shortName: 'MI3',
      price: 3,
      category: CategoryEnum.BEVERAGE,
    },
  ];

  const mockMenuItem = {
    fullName: 'Delicious Pizza Regina',
    shortName: 'pizza',
    price: 12,
    category: CategoryEnum.MAIN,
    _id: 'pizza id',
  };

  const mockGetMenuItemParams: GetMenuItemParams = {
    menuItemId: mockMenuItem._id,
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [MenusController],
      providers: [
        {
          provide: MenusService,
          useValue: {
            findAll: jest.fn().mockResolvedValue(mockMenuItemList),
            findOne: jest.fn().mockResolvedValue(mockMenuItem),
            create: jest.fn().mockResolvedValue(addMenuItemDto),
          },
        },
      ],
    }).compile();

    controller = module.get<MenusController>(MenusController);
    service = module.get<MenusService>(MenusService);
  });

  describe('getFullMenu()', () => {
    it('should return an array of menu items', async () => {
      expect(controller.getFullMenu()).resolves.toEqual(mockMenuItemList);
      expect(service.findAll).toHaveBeenCalled();
    });
  });

  describe('getMenuItem()', () => {
    it('should return the searched menu item', async () => {
      expect(controller.getMenuItem(mockGetMenuItemParams)).resolves.toEqual(mockMenuItem);
      expect(service.findOne).toHaveBeenCalledWith(mockGetMenuItemParams.menuItemId);
    });
  });

  describe('addMenuItem()', () => {
    it('should create a menu item', async () => {
      const createSpy = jest
        .spyOn(service, 'create')
        .mockResolvedValueOnce(mockMenuItem);

      await controller.addMenuItem(addMenuItemDto);
      expect(createSpy).toHaveBeenCalledWith(addMenuItemDto);
    });
  });
});
