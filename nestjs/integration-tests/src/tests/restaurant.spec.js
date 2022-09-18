import _keyBy from 'lodash/keyBy';
import _cloneDeep from 'lodash/cloneDeep';

import {
  frisby,
  Joi,
  getMenuServiceBaseUrl,
  getDiningServiceBaseUrl,
  getKitchenServiceBaseUrl,
} from '../config/config.js';

import { TableValidator } from '../validators/table.validator.js';
import { MenuItemValidator } from '../validators/menu-item.validator.js';
import { StartOrderingDto } from '../dto/start-ordering.dto.js';
import { TableOrderValidator } from '../validators/table-order.validator.js';
import { AddMenuItemDto } from '../dto/add-menu-item.dto.js';
import { PreparationValidator } from '../validators/preparation.validator.js';
import { PreparationLiteValidator } from '../validators/preparation-lite.validator.js';
import { PreparedItemValidator } from '../validators/prepared-item.validator.js';

const sleep = ms => new Promise(r => setTimeout(r, ms));

describe('Restaurant', () => {
  let menuBaseUrl;
  let diningBaseUrl;
  let kitchenBaseUrl;

  // menu service paths
  const menuServiceMenusPath = '/menus';

  // dining service paths
  const diningServiceTablesPath = '/tables';
  const diningServiceTableOrdersPath = '/tableOrders';

  // kitchen service paths
  const kitchenServicePreparationsPath = '/preparations';
  const kitchenServicePreparedItemsPath = '/preparedItems';

  beforeAll(() => {
    menuBaseUrl = getMenuServiceBaseUrl();
    diningBaseUrl = getDiningServiceBaseUrl();
    kitchenBaseUrl = getKitchenServiceBaseUrl();

    console.log('Using: menuBaseUrl', menuBaseUrl);
    console.log('Using: diningBaseUrl', diningBaseUrl);
    console.log('Using: kitchenBaseUrl', kitchenBaseUrl);
  });

  describe('a full ordering', () => {
    const routePath = '/tables';

    it('should work', async () => {
      const customersCount = 6;

      let menuItems;
      let menuItemsByShortName;
      let tables;
      let currentTableOrder;
      let preparationsFromDining;
      let preparationsFromKitchen;
      let barPreparedItems;
      let hotDishesPreparedItems;
      let readyBarPreparation;
      let readyHotDishesPreparation;

      // Retrieve menu
      console.log('Retrieve menu');
      await frisby
        .get(`${menuBaseUrl}${menuServiceMenusPath}`)
        .expect("status", 200)
        .expect("jsonTypesStrict", "*", MenuItemValidator)
        .then((res) => {
          menuItems = res.json;
          menuItemsByShortName = _keyBy(menuItems, 'shortName');
        });

      // Find an available table
      console.log('Find an available table');
      await frisby
        .get(`${diningBaseUrl}${diningServiceTablesPath}`)
        .expect("status", 200)
        .expect("jsonTypesStrict", "*", TableValidator)
        .then((res) => {
          tables = res.json;
        });

      const firstAvailableTable = tables.find((table) => !table.taken);

      if (!firstAvailableTable) throw new Error('No table is available');

      // Open the table for orders
      console.log('Open the table for orders');
      const startOrderingDto = new StartOrderingDto(firstAvailableTable.number, customersCount);
      await frisby
        .post(`${diningBaseUrl}${diningServiceTableOrdersPath}`, startOrderingDto)
        .expect("status", 201)
        .expect("jsonTypesStrict", TableOrderValidator)
        .then((res) => {
          currentTableOrder = res.json;

          expect(currentTableOrder.billed).toBeNull();
        });

      // Check table is taken
      console.log('Check table is taken');
      await frisby
        .get(`${diningBaseUrl}${diningServiceTablesPath}/${firstAvailableTable.number}`)
        .expect("status", 200)
        .expect("jsonTypesStrict", TableValidator)
        .then((res) => {
          expect(res.json.taken).toBeTruthy();
          expect(res.json.tableOrderId).toEqual(currentTableOrder._id);
        });

      // Ordering 2 pizzas
      console.log('Ordering 2 pizzas');
      const pizzaMenuItem = menuItemsByShortName['pizza'];
      const add2PizzasToOrder = new AddMenuItemDto(pizzaMenuItem._id, pizzaMenuItem.shortName, 2);
      await frisby
        .post(`${diningBaseUrl}${diningServiceTableOrdersPath}/${currentTableOrder._id}`, add2PizzasToOrder)
        .expect("status", 201)
        .expect("jsonTypesStrict", TableOrderValidator)
        .then((res) => {
          currentTableOrder = res.json;

          expect(currentTableOrder.lines.length).toEqual(1);
        });

      // Ordering 3 cokes
      console.log('Ordering 3 cokes');
      const cokeMenuItem = menuItemsByShortName['coke'];
      const add3CokesToOrder = new AddMenuItemDto(cokeMenuItem._id, cokeMenuItem.shortName, 3);
      await frisby
        .post(`${diningBaseUrl}${diningServiceTableOrdersPath}/${currentTableOrder._id}`, add3CokesToOrder)
        .expect("status", 201)
        .expect("jsonTypesStrict", TableOrderValidator)
        .then((res) => {
          currentTableOrder = res.json;

          expect(currentTableOrder.lines.length).toEqual(2);
        });

      // Send order to preparation
      console.log('Send order to preparation');
      await frisby
        .post(`${diningBaseUrl}${diningServiceTableOrdersPath}/${currentTableOrder._id}/prepare`)
        .expect("status", 201)
        .expect("jsonTypesStrict", '*', PreparationLiteValidator)
        .then((res) => {
          preparationsFromDining = res.json;

          expect(preparationsFromDining.length).toEqual(2);

          const preparedItems = preparationsFromDining.flatMap((preparation) => (preparation.preparedItems));

          expect(preparedItems.length).toEqual(5);
        });

      // Check items in preparation in kitchen
      console.log('Check items in preparation in kitchen');
      await frisby
        .get(`${kitchenBaseUrl}${kitchenServicePreparationsPath}?state=preparationStarted&tableNumber=${firstAvailableTable.number}`)
        .expect("status", 200)
        .expect("jsonTypesStrict", "*", PreparationValidator)
        .then((res) => {
          preparationsFromKitchen = res.json;
          expect(preparationsFromKitchen.length).toEqual(2);

          const preparedItems = preparationsFromKitchen.flatMap((preparation) => (preparation.preparedItems));

          expect(preparedItems.length).toEqual(5);

          /* Check preparations diff between dining and kitchen */
          const prepsFromDining = _cloneDeep(preparationsFromDining);
          const prepsFromKitchen = _cloneDeep(preparationsFromKitchen);
          while (prepsFromDining.length > 0) {
            const preparation = prepsFromDining.shift();
            const prepsFromKitchenIndex = prepsFromKitchen.findIndex((prepFromKitchen) => (prepFromKitchen._id === preparation._id));

            expect(prepsFromKitchenIndex).not.toEqual(-1);

            prepsFromKitchen.splice(prepsFromKitchenIndex, 1);
          }

          expect(prepsFromDining.length).toEqual(0);
          expect(prepsFromKitchen.length).toEqual(0);

          /* Check prepared items diff between dining and kitchen */
          const prepItemsFromDining = _cloneDeep(preparationsFromDining).flatMap((preparation) => (preparation.preparedItems));
          const prepItemsFromKitchen = _cloneDeep(preparationsFromKitchen).flatMap((preparation) => (preparation.preparedItems));
          while (prepItemsFromDining.length > 0) {
            const preparedItem = prepItemsFromDining.shift();
            const prepItemsFromKitchenIndex = prepItemsFromKitchen.findIndex((prepItemFromKitchen) => (prepItemFromKitchen._id === preparedItem._id));

            expect(prepItemsFromKitchenIndex).not.toEqual(-1);

            prepItemsFromKitchen.splice(prepItemsFromKitchenIndex, 1);
          }

          expect(prepItemsFromDining.length).toEqual(0);
          expect(prepItemsFromKitchen.length).toEqual(0);
        });

      // Check items ready to be served in kitchen
      console.log('Check items ready to be served in kitchen');
      await frisby
        .get(`${kitchenBaseUrl}${kitchenServicePreparationsPath}?state=readyToBeServed&tableNumber=${firstAvailableTable.number}`)
        .expect("status", 200)
        .expect("jsonTypesStrict", Joi.array())
        .then((res) => {
          expect(res.json.length).toEqual(0);
        });

      // Check preparations for each post
      console.log('Check preparations for each post');
      await frisby
        .get(`${kitchenBaseUrl}${kitchenServicePreparedItemsPath}?post=BAR`)
        .expect("status", 200)
        .expect("jsonTypesStrict", "*", PreparedItemValidator)
        .then((res) => {
          barPreparedItems = res.json;
          expect(barPreparedItems.length).toEqual(3);
        });

      await frisby
        .get(`${kitchenBaseUrl}${kitchenServicePreparedItemsPath}?post=HOT_DISH`)
        .expect("status", 200)
        .expect("jsonTypesStrict", "*", PreparedItemValidator)
        .then((res) => {
          hotDishesPreparedItems = res.json;
          expect(hotDishesPreparedItems.length).toEqual(2);
        });

      // Start "cooking" in Bar
      console.log('Start "cooking" in Bar');
      for (let i = 0; i < barPreparedItems.length; i += 1) {
        const preparedItem = barPreparedItems[i];
        await frisby
          .post(`${kitchenBaseUrl}${kitchenServicePreparedItemsPath}/${preparedItem._id}/start`)
          .expect("status", 200)
          .expect("jsonTypesStrict", PreparedItemValidator);
      }
      await frisby
        .get(`${kitchenBaseUrl}${kitchenServicePreparedItemsPath}?post=BAR`)
        .expect("status", 200)
        .expect("jsonTypesStrict", Joi.array())
        .then((res) => {
          expect(res.json.length).toEqual(0);
        });

      // Finish "cooking" at Bar
      console.log('Finish "cooking" at Bar');
      for (let i = 0; i < barPreparedItems.length; i += 1) {
        const preparedItem = barPreparedItems[i];
        await frisby
          .post(`${kitchenBaseUrl}${kitchenServicePreparedItemsPath}/${preparedItem._id}/finish`)
          .expect("status", 200)
          .expect("jsonTypesStrict", PreparedItemValidator);
      }
      await frisby
        .get(`${kitchenBaseUrl}${kitchenServicePreparationsPath}?state=readyToBeServed&tableNumber=${firstAvailableTable.number}`)
        .expect("status", 200)
        .expect("jsonTypesStrict", "*", PreparationValidator)
        .then((res) => {
          expect(res.json.length).toEqual(1);
          readyBarPreparation = res.json[0];
          expect(readyBarPreparation.preparedItems[0].shortName).toEqual('coke');
        });
      await frisby
        .get(`${kitchenBaseUrl}${kitchenServicePreparationsPath}?state=preparationStarted&tableNumber=${firstAvailableTable.number}`)
        .expect("status", 200)
        .expect("jsonTypesStrict", "*", PreparationValidator)
        .then((res) => {
          expect(res.json.length).toEqual(1);
          expect(res.json[0].preparedItems[0].shortName).toEqual('pizza');
        });

      // Serve the cokes
      console.log('Serve the cokes');
      await frisby
        .post(`${kitchenBaseUrl}${kitchenServicePreparationsPath}/${readyBarPreparation._id}/takenToTable`)
        .expect("status", 200)
        .expect("jsonTypesStrict", PreparationValidator)
        .then((res) => {
          expect(res.json.takenForServiceAt).not.toBeNull();
        });

      // Start "cooking" in Hot Dish post
      console.log('Start "cooking" in Hot Dish post');
      for (let i = 0; i < hotDishesPreparedItems.length; i += 1) {
        const preparedItem = hotDishesPreparedItems[i];
        await frisby
          .post(`${kitchenBaseUrl}${kitchenServicePreparedItemsPath}/${preparedItem._id}/start`)
          .expect("status", 200)
          .expect("jsonTypesStrict", PreparedItemValidator);
      }
      await frisby
        .get(`${kitchenBaseUrl}${kitchenServicePreparedItemsPath}?post=HOT_DISH`)
        .expect("status", 200)
        .expect("jsonTypesStrict", Joi.array())
        .then((res) => {
          expect(res.json.length).toEqual(0);
        });

      // Finish "cooking" at Hot Dish post
      console.log('Finish "cooking" at Hot Dish post');
      for (let i = 0; i < hotDishesPreparedItems.length; i += 1) {
        const preparedItem = hotDishesPreparedItems[i];
        await frisby
          .post(`${kitchenBaseUrl}${kitchenServicePreparedItemsPath}/${preparedItem._id}/finish`)
          .expect("status", 200)
          .expect("jsonTypesStrict", PreparedItemValidator);
      }
      await frisby
        .get(`${kitchenBaseUrl}${kitchenServicePreparationsPath}?state=readyToBeServed&tableNumber=${firstAvailableTable.number}`)
        .expect("status", 200)
        .expect("jsonTypesStrict", "*", PreparationValidator)
        .then((res) => {
          expect(res.json.length).toEqual(1);
          readyHotDishesPreparation = res.json[0];
          expect(readyHotDishesPreparation.preparedItems[0].shortName).toEqual('pizza');
        });
      await frisby
        .get(`${kitchenBaseUrl}${kitchenServicePreparationsPath}?state=preparationStarted&tableNumber=${firstAvailableTable.number}`)
        .expect("status", 200)
        .expect("jsonTypesStrict", Joi.array())
        .then((res) => {
          expect(res.json.length).toEqual(0);
        });

      // Serve the pizzas
      console.log('Serve the pizzas');
      await frisby
        .post(`${kitchenBaseUrl}${kitchenServicePreparationsPath}/${readyHotDishesPreparation._id}/takenToTable`)
        .expect("status", 200)
        .expect("jsonTypesStrict", PreparationValidator)
        .then((res) => {
          expect(res.json.takenForServiceAt).not.toBeNull();
        });

      // Bill the table
      console.log('Bill the table');
      await frisby
        .post(`${diningBaseUrl}${diningServiceTableOrdersPath}/${currentTableOrder._id}/bill`)
        .expect("status", 200)
        .expect("jsonTypesStrict", TableOrderValidator)
        .then((res) => {
          currentTableOrder = res.json;

          expect(currentTableOrder.billed).not.toBeNull();
        });

      // Check table is well billed
      console.log('Check table is well billed');
      await frisby
        .post(`${diningBaseUrl}${diningServiceTableOrdersPath}/${currentTableOrder._id}/bill`)
        .expect("status", 422);

      // Check table is released
      console.log('Check table is released');
      await frisby
        .get(`${diningBaseUrl}${diningServiceTablesPath}/${firstAvailableTable.number}`)
        .expect("status", 200)
        .expect("jsonTypesStrict", TableValidator)
        .then((res) => {
          expect(res.json.taken).toBeFalsy();
          expect(res.json.tableOrderId).toBeNull();
        });
    });
  });
});
