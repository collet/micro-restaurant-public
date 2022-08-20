import {
  frisby,
  getDiningServiceBaseUrl,
} from '../config/config.js';

import { Table } from '../dto/table.dto.js';

describe('Dining Service', () => {
  let baseUrl;

  beforeAll(() => {
    baseUrl = getDiningServiceBaseUrl();
  });

  describe('/tables routes', () => {
    const routePath = '/tables';

    describe('GET /tables', () => {
      it('should return the tables', () => {
        return frisby
          .get(`${baseUrl}${routePath}`)
          .expect("status", 200)
          .expect("jsonTypesStrict", "*", Table)
          .then((res) => {
            expect(res.json.length).toBeGreaterThanOrEqual(3);
          });
      });
    });
  });
});
