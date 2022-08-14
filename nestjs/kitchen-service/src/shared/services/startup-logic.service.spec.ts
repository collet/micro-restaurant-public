import { Test, TestingModule } from '@nestjs/testing';
import { getConnectionToken } from '@nestjs/mongoose';
import { Connection } from 'mongoose';

import { StartupLogicService } from './startup-logic.service';

import { AddMenuItemDto } from '../../menus/dto/add-menu-item.dto';

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
              MenuItem: {
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

  it('should return a AddMenuItemDto instance', () => {
    const mockFullName = 'my fullname';
    const mockShortName = 'my shortName';
    const mockPrice = 8;

    const menuItem: AddMenuItemDto = new AddMenuItemDto();
    menuItem.fullName = mockFullName;
    menuItem.shortName = mockShortName;
    menuItem.price = mockPrice;

    const addMenuItem = service.createMenuItem(mockFullName, mockShortName, mockPrice);
    expect(addMenuItem).toEqual(menuItem);
  });

  it('should add a new menu item', async () => {
    const mockFullName = 'my fullname';
    const mockShortName = 'my shortName';
    const mockPrice = 8;

    const mockMenuItem = {
      fullName: mockFullName,
      shortName: mockShortName,
      price: mockPrice,
    };

    jest.spyOn(connection.models.MenuItem, 'find').mockResolvedValueOnce([]);
    jest.spyOn(connection.models.MenuItem, 'create').mockImplementationOnce(() =>
      Promise.resolve(mockMenuItem),
    );
    const newMenuItem = await service.addMenuItem(mockFullName, mockShortName, mockPrice);
    expect(newMenuItem).toEqual(mockMenuItem);
  });

  it('should throw an error if menu item already exists', async () => {
    const mockFullName = 'my fullname';
    const mockShortName = 'my shortName';
    const mockPrice = 8;

    const mockMenuItem = {
      fullName: mockFullName,
      shortName: mockShortName,
      price: mockPrice,
    };

    jest.spyOn(connection.models.MenuItem, 'find').mockResolvedValueOnce([mockMenuItem]);

    const testAddMenuItem = async () => {
      await service.addMenuItem(mockFullName, mockShortName, mockPrice);
    };
    await expect(testAddMenuItem).rejects.toThrow();
  });

  it ('should seed the db with some menu items', async () => {
    service.addMenuItem = jest.fn();
    await service.onApplicationBootstrap();

    expect(service.addMenuItem).toHaveBeenCalledTimes(3);
  });
});
