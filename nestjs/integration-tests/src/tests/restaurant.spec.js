import _keyBy from 'lodash/keyBy';

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
import { CookedItemValidator } from '../validators/cooked-item.validator.js';

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
  const kitchenServiceCookedItemsPath = '/cookedItems';

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
      let cookedItems;

      // Retrieve menu
      await frisby
        .get(`${menuBaseUrl}${menuServiceMenusPath}`)
        .expect("status", 200)
        .expect("jsonTypesStrict", "*", MenuItemValidator)
        .then((res) => {
          menuItems = res.json;
          menuItemsByShortName = _keyBy(menuItems, 'shortName');
        });

      // Find an available table
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
      await frisby
        .get(`${diningBaseUrl}${diningServiceTablesPath}/${firstAvailableTable.number}`)
        .expect("status", 200)
        .expect("jsonTypesStrict", TableValidator)
        .then((res) => {
          expect(res.json.taken).toBeTruthy();
          expect(res.json.tableOrderId).toEqual(currentTableOrder._id);
        });

      // Ordering 2 pizzas
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
      await frisby
        .post(`${diningBaseUrl}${diningServiceTableOrdersPath}/${currentTableOrder._id}/prepare`)
        .expect("status", 201)
        .expect("jsonTypesStrict", '*', CookedItemValidator)
        .then((res) => {
          cookedItems = res.json;

          expect(cookedItems.length).toEqual(5);
        });

      // Check items in preparation in kitchen
      await frisby
        .get(`${kitchenBaseUrl}${kitchenServiceCookedItemsPath}?state=preparationStarted`)
        .expect("status", 200)
        .expect("jsonTypesStrict", "*", CookedItemValidator)
        .then((res) => {
          expect(res.json.length).toEqual(5);
        });

      // Check items ready to be served in kitchen
      await frisby
        .get(`${kitchenBaseUrl}${kitchenServiceCookedItemsPath}?state=readyToBeServed`)
        .expect("status", 200)
        .expect("jsonTypesStrict", Joi.array())
        .then((res) => {
          expect(res.json.length).toEqual(0);
        });

      // Wait for items to be cooked (max 10 seconds for pizza)
      await sleep(10 * 1000);

      // Check items ready to be served in kitchen
      await frisby
        .get(`${kitchenBaseUrl}${kitchenServiceCookedItemsPath}?state=readyToBeServed`)
        .expect("status", 200)
        .expect("jsonTypesStrict", "*", CookedItemValidator)
        .then((res) => {
          expect(res.json.length).toEqual(5);
        });

      // Serve all items to the table
      const serveItemsCalls = [];
      cookedItems.forEach((cookedItem) => {
        serveItemsCalls.push(
          frisby
            .post(`${kitchenBaseUrl}${kitchenServiceCookedItemsPath}/${cookedItem._id}/takenToTable`)
            .expect("status", 200)
            .expect("jsonTypesStrict", CookedItemValidator)
        );
      });

      await Promise.all(serveItemsCalls);

      // Bill the table
      await frisby
        .post(`${diningBaseUrl}${diningServiceTableOrdersPath}/${currentTableOrder._id}/bill`)
        .expect("status", 200)
        .expect("jsonTypesStrict", TableOrderValidator)
        .then((res) => {
          currentTableOrder = res.json;

          expect(currentTableOrder.billed).not.toBeNull();
        });

      // Check table is well billed
      await frisby
        .post(`${diningBaseUrl}${diningServiceTableOrdersPath}/${currentTableOrder._id}/bill`)
        .expect("status", 422);

      // Check table is released
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
