import { Test, TestingModule } from '@nestjs/testing';
import { getModelToken } from '@nestjs/mongoose';
import { Model } from 'mongoose';

import { MenusService } from './menus.service';
import { MenuItem } from '../schemas/menu-item.schema';
import { CategoryEnum } from '../schemas/category-enum.schema';

import { AddMenuItemDto } from '../dto/add-menu-item.dto';

import { MenuItemIdNotFoundException } from '../exceptions/menu-item-id-not-found.exception';
import { MenuItemShortNameAlreadyExistsException } from '../exceptions/menu-item-short-name-already-exists.exception';

describe('MenusService', () => {
  let service: MenusService;
  let model: Model<MenuItem>;

  const addMenuItemDto: AddMenuItemDto = {
    fullName: 'Delicious Pizza Regina',
    shortName: 'pizza',
    price: 12,
    category: CategoryEnum.MAIN,
    image: 'https://cdn.pixabay.com/photo/2020/02/27/20/13/cake-4885715_1280.jpg',
  };

  const mockMenuItem = {
    fullName: 'Delicious Pizza Regina',
    shortName: 'pizza',
    price: 12,
    category: CategoryEnum.MAIN,
    image: 'https://cdn.pixabay.com/photo/2020/02/27/20/13/cake-4885715_1280.jpg',
  };

  const mockMenuItemList = [
    {
      fullName: 'MenuItem #1',
      shortName: 'MI1',
      price: 1,
      category: CategoryEnum.STARTER,
      image: 'https://cdn.pixabay.com/photo/2020/02/27/20/13/cake-4885715_1280.jpg',
    },
    {
      fullName: 'MenuItem #2',
      shortName: 'MI2',
      price: 2,
      category: CategoryEnum.DESSERT,
      image: null,
    },
    {
      fullName: 'MenuItem #3',
      shortName: 'MI3',
      price: 3,
      category: CategoryEnum.BEVERAGE,
      image: null,
    },
  ];

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        MenusService,
        {
          provide: getModelToken('MenuItem'),
          useValue: {
            new: jest.fn().mockResolvedValue(mockMenuItem),
            constructor: jest.fn().mockResolvedValue(mockMenuItem),
            find: jest.fn(),
            findOne: jest.fn(),
            create: jest.fn(),
            exec: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<MenusService>(MenusService);
    model = module.get<Model<MenuItem>>(getModelToken('MenuItem'));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should return all menu items', async () => {
    jest.spyOn(model, 'find').mockReturnValue({
      lean: jest.fn().mockResolvedValueOnce(mockMenuItemList),
    } as any);
    const menuItems = await service.findAll();
    expect(menuItems).toEqual(mockMenuItemList);
  });

  it('should return the searched menu item', async () => {
    jest.spyOn(model, 'findOne').mockReturnValue({
      lean: jest.fn().mockResolvedValueOnce(mockMenuItem),
    } as any);
    const menuItem = await service.findOne('pizza id');
    expect(menuItem).toEqual(mockMenuItem);
  });

  it('should return MenuItemIdNotFoundException if the searched menu item is not found', async () => {
    jest.spyOn(model, 'findOne').mockReturnValue({
      lean: jest.fn().mockResolvedValueOnce(null),
    } as any);
    const testFindOne = async () => {
      await service.findOne('pizza id');
    };
    await expect(testFindOne).rejects.toThrow(MenuItemIdNotFoundException);
  });

  it('should insert a new menu item', async () => {
    jest.spyOn(model, 'find').mockResolvedValueOnce([]);
    jest.spyOn(model, 'create').mockImplementationOnce(() =>
      Promise.resolve(mockMenuItem),
    );
    const newMenuItem = await service.create(addMenuItemDto);
    expect(newMenuItem).toEqual(mockMenuItem);
  });

  it('should return MenuItemShortNameAlreadyExistsException if menu item already exists', async () => {
    jest.spyOn(model, 'find').mockResolvedValueOnce([mockMenuItem]);

    const testCreate = async () => {
      await service.create(addMenuItemDto);
    };
    await expect(testCreate).rejects.toThrow(MenuItemShortNameAlreadyExistsException);
  });
});
