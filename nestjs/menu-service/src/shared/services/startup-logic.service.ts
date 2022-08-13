import { OnApplicationBootstrap } from '@nestjs/common';
import { InjectConnection } from '@nestjs/mongoose';
import { Connection } from 'mongoose';

import { AddMenuItemDto } from '../../menus/dto/add-menu-item.dto';

export class StartupLogicService implements OnApplicationBootstrap {
  constructor(@InjectConnection() private connection: Connection) {}

  createMenuItem(fullName: string, shortName: string, price: number): AddMenuItemDto {
    const menuItem: AddMenuItemDto = new AddMenuItemDto();
    menuItem.fullName = fullName;
    menuItem.shortName = shortName;
    menuItem.price = price;
    return menuItem;
  }

  async addMenuItem(fullName: string, shortName: string, price: number) {
    const menuItemModel = this.connection.models['MenuItem'];

    const alreadyExists = await menuItemModel.find({ shortName });
    if (alreadyExists.length > 0) {
      throw new Error('Menu Item already exists.');
    }

    return menuItemModel.create(this.createMenuItem(fullName, shortName, price));
  }

  async onApplicationBootstrap() {
    try {
      await this.addMenuItem('Delicious Pizza Regina','pizza',12);
      await this.addMenuItem('Lasagna al forno','lasagna',16);
      await this.addMenuItem('Bottled coke (33cl)','coke',3.5);
    } catch (e) {
    }
  }
}
