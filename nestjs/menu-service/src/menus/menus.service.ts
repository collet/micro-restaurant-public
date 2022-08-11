import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

import { MenuItem, MenuItemDocument } from './schemas/menu-item.schema';
import { AddMenuItemDto } from './dto/add-menu-item.dto';

@Injectable()
export class MenusService {
  constructor(@InjectModel(MenuItem.name) private menuItemModel: Model<MenuItemDocument>) {}

  async findAll(): Promise<MenuItem[]> {
    return this.menuItemModel.find().exec();
  }

  async findOne(menuItemId: string): Promise<MenuItem> {
    return this.menuItemModel.findOne({ _id: menuItemId }).exec();
  }

  async create(addMenuItemDto: AddMenuItemDto): Promise<MenuItem> {
    return await this.menuItemModel.create(addMenuItemDto);
  }
}
