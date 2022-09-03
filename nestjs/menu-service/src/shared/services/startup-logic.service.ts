import { OnApplicationBootstrap } from '@nestjs/common';
import { InjectConnection } from '@nestjs/mongoose';
import { Connection } from 'mongoose';

import { AddMenuItemDto } from '../../menus/dto/add-menu-item.dto';

import { CategoryEnum } from '../../menus/schemas/category-enum.schema';

export class StartupLogicService implements OnApplicationBootstrap {
  constructor(@InjectConnection() private connection: Connection) {}

  createMenuItem(fullName: string, shortName: string, price: number, category: CategoryEnum): AddMenuItemDto {
    const menuItem: AddMenuItemDto = new AddMenuItemDto();
    menuItem.fullName = fullName;
    menuItem.shortName = shortName;
    menuItem.price = price;
    menuItem.category = category;
    return menuItem;
  }

  async addMenuItem(fullName: string, shortName: string, price: number, category: CategoryEnum) {
    const menuItemModel = this.connection.models['MenuItem'];

    const alreadyExists = await menuItemModel.find({ shortName });
    if (alreadyExists.length > 0) {
      throw new Error('Menu Item already exists.');
    }

    return menuItemModel.create(this.createMenuItem(fullName, shortName, price, category));
  }

  async onApplicationBootstrap() {
    try {
      await this.addMenuItem('Homemade foie gras terrine','foie gras',18, CategoryEnum.STARTER);
    } catch (e) {
    }
    try {
      await this.addMenuItem('Soft-boiled egg breaded with breadcrumbs and nuts','soft-boiled egg',16, CategoryEnum.STARTER);
    } catch (e) {
    }
    try {
      await this.addMenuItem('Goat cheese foom from "Valbonne goat farm"','goat cheese',15, CategoryEnum.STARTER);
    } catch (e) {
    }
    try {
      await this.addMenuItem('Homemade dill salmon gravlax','salmon',16, CategoryEnum.STARTER);
    } catch (e) {
    }
    try {
      await this.addMenuItem('Crab maki with fresh mango','crab maki',16, CategoryEnum.STARTER);
    } catch (e) {
    }
    try {
      await this.addMenuItem('Burrata Mozzarella','burrata',16, CategoryEnum.STARTER);
    } catch (e) {
    }
    try {
      await this.addMenuItem('Delicious Pizza Regina','pizza',12, CategoryEnum.MAIN);
    } catch (e) {
    }
    try {
      await this.addMenuItem('Lasagna al forno','lasagna',18, CategoryEnum.MAIN);
    } catch (e) {
    }
    try {
      await this.addMenuItem('Homemade beef burger','beeef burger',19, CategoryEnum.MAIN);
    } catch (e) {
    }
    try {
      await this.addMenuItem('Beef chuck cooked 48 hours at low temperature','beef chuck',24, CategoryEnum.MAIN);
    } catch (e) {
    }
    try {
      await this.addMenuItem('Half cooked tuna and octopus grilled on the plancha','half cooked tuna',23, CategoryEnum.MAIN);
    } catch (e) {
    }
    try {
      await this.addMenuItem('Brownie (home made)','brownie',6.5, CategoryEnum.DESSERT);
    } catch (e) {
    }
    try {
      await this.addMenuItem('Valrhona chocolate declination with salted chocolate ice cream','chocolate',12, CategoryEnum.DESSERT);
    } catch (e) {
    }
    try {
      await this.addMenuItem('Marmalade of Menton\'s lemon - Lemon cream - Limoncello jelly and sorbet - Homemade meringue','lemon',12, CategoryEnum.DESSERT);
    } catch (e) {
    }
    try {
      await this.addMenuItem('Fresh raspberries and peaches','rasp and peaches',12, CategoryEnum.DESSERT);
    } catch (e) {
    }
    try {
      await this.addMenuItem('Dessert of fresh strawberries and vanilla mascarpone mousse','strawberries',12, CategoryEnum.DESSERT);
    } catch (e) {
    }
    try {
      await this.addMenuItem('Fresh seasonal fruit','seasonal fruit',12, CategoryEnum.DESSERT);
    } catch (e) {
    }
    try {
      await this.addMenuItem('Speculoos tiramisu','tiramisu',10, CategoryEnum.DESSERT);
    } catch (e) {
    }
    try {
      await this.addMenuItem('Bottled coke (33cl)','coke',3.5, CategoryEnum.BEVERAGE);
    } catch (e) {
    }
    try {
      await this.addMenuItem('Ice Tea (33cl)','ice tea',3.5, CategoryEnum.BEVERAGE);
    } catch (e) {
    }
    try {
      await this.addMenuItem('Bottled water','bottled water',1, CategoryEnum.BEVERAGE);
    } catch (e) {
    }
    try {
      await this.addMenuItem('Sparkling water','sparkling water',1.5, CategoryEnum.BEVERAGE);
    } catch (e) {
    }
    try {
      await this.addMenuItem('Spritz','spritz',5, CategoryEnum.BEVERAGE);
    } catch (e) {
    }
    try {
      await this.addMenuItem('Margarita','margarita',6.5, CategoryEnum.BEVERAGE);
    } catch (e) {
    }
    try {
      await this.addMenuItem('Tequila sunrise','tequila',7, CategoryEnum.BEVERAGE);
    } catch (e) {
    }
    try {
      await this.addMenuItem('Mojito','mojito',6, CategoryEnum.BEVERAGE);
    } catch (e) {
    }
    try {
      await this.addMenuItem('Martini','martini',7, CategoryEnum.BEVERAGE);
    } catch (e) {
    }
    try {
      await this.addMenuItem('Lemonade','lemonade',3, CategoryEnum.BEVERAGE);
    } catch (e) {
    }
    try {
      await this.addMenuItem('Apple juice','apple juice',3, CategoryEnum.BEVERAGE);
    } catch (e) {
    }
    try {
      await this.addMenuItem('Café','café',1.8, CategoryEnum.BEVERAGE);
    } catch (e) {
    }
  }
}
