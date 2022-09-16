import {
  frisby,
  getMenuServiceBaseUrl,
} from '../config/config.js';

import { MenuItemValidator } from '../validators/menu-item.validator.js';

describe('Menu Service', () => {
  let baseUrl;

  beforeAll(() => {
    baseUrl = getMenuServiceBaseUrl();
  });

  describe('/menus routes', () => {
    const routePath = '/menus';

    describe('GET /menus', () => {
      it('should return full menu', () => {
        return frisby
          .get(`${baseUrl}${routePath}`)
          .expect("status", 200)
          .expect("jsonTypesStrict", "*", MenuItemValidator)
          .then((res) => {
            expect(res.json.length).toBeGreaterThanOrEqual(30);
          });
      });
    });
  });
});
