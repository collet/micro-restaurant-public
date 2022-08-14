import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

import { MenuItem, MenuItemDocument } from '../schemas/menu-item.schema';

import { AddMenuItemDto } from '../dto/add-menu-item.dto';

import { MenuItemShortNameAlreadyExistsException } from '../exceptions/menu-item-short-name-already-exists.exception';
import { MenuItemIdNotFoundException } from '../exceptions/menu-item-id-not-found.exception';

@Injectable()
export class MenusService {
  constructor(@InjectModel(MenuItem.name) private menuItemModel: Model<MenuItemDocument>) {}

  async findAll(): Promise<MenuItem[]> {
    return this.menuItemModel.find().lean();
  }

  async findOne(menuItemId: string): Promise<MenuItem> {
    const foundItem = await this.menuItemModel.findOne({ _id: menuItemId }).lean();

    if (foundItem === null) {
      throw new MenuItemIdNotFoundException(menuItemId);
    }

    return foundItem;
  }

  async create(addMenuItemDto: AddMenuItemDto): Promise<MenuItem> {
    const alreadyExists = await this.menuItemModel.find({ shortName: addMenuItemDto.shortName });
    if (alreadyExists.length > 0) {
      throw new MenuItemShortNameAlreadyExistsException(addMenuItemDto.shortName);
    }
    return await this.menuItemModel.create(addMenuItemDto);
  }
}
