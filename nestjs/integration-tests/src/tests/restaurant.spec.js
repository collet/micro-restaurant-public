import {
  frisby,
  getMenuServiceBaseUrl,
  getDiningServiceBaseUrl,
  getKitchenServiceBaseUrl,
} from '../config/config.js';

import { Table } from '../dto/table.dto.js';
import { MenuItem } from '../dto/menu-item.dto.js';

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
  });

  describe('a full ordering', () => {
    const routePath = '/tables';

    it('should work', async () => {
      let tables;
      let menuItems;

      await frisby
        .get(`${diningBaseUrl}${diningServiceTablesPath}`)
        .expect("status", 200)
        .expect("jsonTypesStrict", "*", Table)
        .then((res) => {
          tables = res.json;
        });

      await frisby
        .get(`${menuBaseUrl}${menuServiceMenusPath}`)
        .expect("status", 200)
        .expect("jsonTypesStrict", "*", MenuItem)
        .then((res) => {
          menuItems = res.json;
        });

    });
  });
});
