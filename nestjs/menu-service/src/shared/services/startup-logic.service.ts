import { OnApplicationBootstrap } from '@nestjs/common';
import { InjectConnection } from '@nestjs/mongoose';
import { Connection } from 'mongoose';

import { AddMenuItemDto } from '../../menus/dto/add-menu-item.dto';

import { CategoryEnum } from '../../menus/schemas/category-enum.schema';

export class StartupLogicService implements OnApplicationBootstrap {
  constructor(@InjectConnection() private connection: Connection) {}

  createMenuItem(fullName: string, shortName: string, price: number, category: CategoryEnum, image: string = null): AddMenuItemDto {
    const menuItem: AddMenuItemDto = new AddMenuItemDto();
    menuItem.fullName = fullName;
    menuItem.shortName = shortName;
    menuItem.price = price;
    menuItem.category = category;
    menuItem.image = image;
    return menuItem;
  }

  async addMenuItem(fullName: string, shortName: string, price: number, category: CategoryEnum, image: string = null) {
    const menuItemModel = this.connection.models['MenuItem'];

    const alreadyExists = await menuItemModel.find({ shortName });
    if (alreadyExists.length > 0) {
      throw new Error('Menu Item already exists.');
    }

    return menuItemModel.create(this.createMenuItem(fullName, shortName, price, category, image));
  }

  async onApplicationBootstrap() {
    try {
      await this.addMenuItem('Homemade foie gras terrine','foie gras',18, CategoryEnum.STARTER, 'https://cdn.pixabay.com/photo/2016/11/12/15/28/restaurant-1819024_960_720.jpg');
    } catch (e) {
    }
    try {
      await this.addMenuItem('Soft-boiled egg breaded with breadcrumbs and nuts','soft-boiled egg',16, CategoryEnum.STARTER, 'https://cdn.pixabay.com/photo/2019/06/03/22/06/eggs-4250077_960_720.jpg');
    } catch (e) {
    }
    try {
      await this.addMenuItem('Goat cheese foom from "Valbonne goat farm"','goat cheese',15, CategoryEnum.STARTER, 'https://cdn.pixabay.com/photo/2016/09/15/19/24/salad-1672505_960_720.jpg');
    } catch (e) {
    }
    try {
      await this.addMenuItem('Homemade dill salmon gravlax','salmon',16, CategoryEnum.STARTER, 'https://cdn.pixabay.com/photo/2014/11/05/15/57/salmon-518032_960_720.jpg');
    } catch (e) {
    }
    try {
      await this.addMenuItem('Crab maki with fresh mango','crab maki',16, CategoryEnum.STARTER, 'https://cdn.pixabay.com/photo/2016/03/05/22/23/asian-1239269_960_720.jpg');
    } catch (e) {
    }
    try {
      await this.addMenuItem('Burrata Mozzarella','burrata',16, CategoryEnum.STARTER, 'https://cdn.pixabay.com/photo/2021/02/08/12/40/burrata-5994616_960_720.jpg');
    } catch (e) {
    }
    try {
      await this.addMenuItem('Delicious Pizza Regina','pizza',12, CategoryEnum.MAIN, 'https://cdn.pixabay.com/photo/2020/02/27/20/13/cake-4885715_1280.jpg');
    } catch (e) {
    }
    try {
      await this.addMenuItem('Lasagna al forno','lasagna',18, CategoryEnum.MAIN, 'https://cdn.pixabay.com/photo/2017/02/15/15/17/meal-2069021_1280.jpg');
    } catch (e) {
    }
    try {
      await this.addMenuItem('Homemade beef burger','beef burger',19, CategoryEnum.MAIN, 'https://cdn.pixabay.com/photo/2022/01/17/19/24/burger-6945571_960_720.jpg');
    } catch (e) {
    }
    try {
      await this.addMenuItem('Beef chuck cooked 48 hours at low temperature','beef chuck',24, CategoryEnum.MAIN, 'https://cdn.pixabay.com/photo/2017/01/23/15/36/eat-2002918_960_720.jpg');
    } catch (e) {
    }
    try {
      await this.addMenuItem('Half cooked tuna and octopus grilled on the plancha','half cooked tuna',23, CategoryEnum.MAIN, 'https://cdn.pixabay.com/photo/2019/09/20/05/53/tuna-4490877_960_720.jpg');
    } catch (e) {
    }
    try {
      await this.addMenuItem('Brownie (home made)','brownie',6.5, CategoryEnum.DESSERT, 'https://cdn.pixabay.com/photo/2014/11/28/08/03/brownie-548591_1280.jpg');
    } catch (e) {
    }
    try {
      await this.addMenuItem('Valrhona chocolate declination with salted chocolate ice cream','chocolate',12, CategoryEnum.DESSERT, 'https://cdn.pixabay.com/photo/2020/07/31/11/53/ice-cream-5452794_960_720.jpg');
    } catch (e) {
    }
    try {
      await this.addMenuItem('Marmalade of Menton\'s lemon - Lemon cream - Limoncello jelly and sorbet - Homemade meringue','lemon',12, CategoryEnum.DESSERT, 'https://cdn.pixabay.com/photo/2018/05/01/18/19/eat-3366425_960_720.jpg');
    } catch (e) {
    }
    try {
      await this.addMenuItem('Fresh raspberries and peaches','rasp and peaches',12, CategoryEnum.DESSERT, 'https://cdn.pixabay.com/photo/2020/05/15/17/28/fruit-plate-5174414_960_720.jpg');
    } catch (e) {
    }
    try {
      await this.addMenuItem('Dessert of fresh strawberries and vanilla mascarpone mousse','strawberries',12, CategoryEnum.DESSERT, 'https://cdn.pixabay.com/photo/2018/04/09/18/20/strawberry-3304967_960_720.jpg');
    } catch (e) {
    }
    try {
      await this.addMenuItem('Fresh seasonal fruit','seasonal fruit',12, CategoryEnum.DESSERT, 'https://cdn.pixabay.com/photo/2016/08/09/19/03/fruit-1581400_960_720.jpg');
    } catch (e) {
    }
    try {
      await this.addMenuItem('Speculoos tiramisu','tiramisu',10, CategoryEnum.DESSERT, 'https://cdn.pixabay.com/photo/2017/03/19/18/22/italian-food-2157246_960_720.jpg');
    } catch (e) {
    }
    try {
      await this.addMenuItem('Bottled coke (33cl)','coke',3.5, CategoryEnum.BEVERAGE, 'https://cdn.pixabay.com/photo/2019/11/14/15/47/coke-4626458_1280.jpg');
    } catch (e) {
    }
    try {
      await this.addMenuItem('Ice Tea (33cl)','ice tea',3.5, CategoryEnum.BEVERAGE, 'https://cdn.pixabay.com/photo/2022/04/11/08/52/iced-tea-7125271_960_720.jpg');
    } catch (e) {
    }
    try {
      await this.addMenuItem('Bottled water','bottled water',1, CategoryEnum.BEVERAGE, 'https://cdn.pixabay.com/photo/2014/12/11/09/49/water-564048_960_720.jpg');
    } catch (e) {
    }
    try {
      await this.addMenuItem('Sparkling water','sparkling water',1.5, CategoryEnum.BEVERAGE, 'https://cdn.pixabay.com/photo/2018/10/23/19/39/water-3768773_960_720.jpg');
    } catch (e) {
    }
    try {
      await this.addMenuItem('Spritz','spritz',5, CategoryEnum.BEVERAGE, 'https://cdn.pixabay.com/photo/2020/05/12/21/17/spritz-5164971_960_720.jpg');
    } catch (e) {
    }
    try {
      await this.addMenuItem('Margarita','margarita',6.5, CategoryEnum.BEVERAGE, 'https://cdn.pixabay.com/photo/2014/08/11/08/37/margarita-415360_960_720.jpg');
    } catch (e) {
    }
    try {
      await this.addMenuItem('Tequila sunrise','tequila',7, CategoryEnum.BEVERAGE, 'https://cdn.pixabay.com/photo/2018/01/25/19/33/summer-3106910_960_720.jpg');
    } catch (e) {
    }
    try {
      await this.addMenuItem('Mojito','mojito',6, CategoryEnum.BEVERAGE, 'https://cdn.pixabay.com/photo/2015/03/30/12/35/mojito-698499_960_720.jpg');
    } catch (e) {
    }
    try {
      await this.addMenuItem('Martini','martini',7, CategoryEnum.BEVERAGE, 'https://cdn.pixabay.com/photo/2015/10/19/07/50/cocktail-995574_960_720.jpg');
    } catch (e) {
    }
    try {
      await this.addMenuItem('Lemonade','lemonade',3, CategoryEnum.BEVERAGE, 'https://cdn.pixabay.com/photo/2016/07/21/11/17/drink-1532300_960_720.jpg');
    } catch (e) {
    }
    try {
      await this.addMenuItem('Apple juice','apple juice',3, CategoryEnum.BEVERAGE, 'https://cdn.pixabay.com/photo/2016/11/28/22/07/punch-1866178_960_720.jpg');
    } catch (e) {
    }
    try {
      await this.addMenuItem('Café','café',1.8, CategoryEnum.BEVERAGE, 'https://cdn.pixabay.com/photo/2014/12/11/02/56/coffee-563797_960_720.jpg');
    } catch (e) {
    }
  }
}
