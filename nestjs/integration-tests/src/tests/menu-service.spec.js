import {
  frisby,
  getMenuServiceBaseUrl,
} from '../config/config.js';

import { MenuItem } from '../dto/menu-item.dto.js';

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
          .expect("jsonTypesStrict", "*", MenuItem)
          .then((res) => {
            expect(res.json.length).toBeGreaterThanOrEqual(3);
          });
      });
    });
  });
});
