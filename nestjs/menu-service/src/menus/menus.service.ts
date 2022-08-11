import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

import { MenuItem, MenuItemDocument } from './schemas/menu-item.schema';

@Injectable()
export class MenusService {
  constructor(@InjectModel(MenuItem.name) private menuItemModel: Model<MenuItemDocument>) {}

  async getFullMenu(): Promise<MenuItem[]> {
    return this.menuItemModel.find().exec();
  }
}
