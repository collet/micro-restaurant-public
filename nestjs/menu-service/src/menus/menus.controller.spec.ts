import { Test, TestingModule } from '@nestjs/testing';

import { MenusController } from './menus.controller';
import { MenusService } from './menus.service';

describe('MenusController', () => {
  let menusController: MenusController;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [MenusController],
      providers: [MenusService],
    }).compile();

    menusController = app.get<MenusController>(MenusController);
  });

  describe('root', () => {
    it('should return "Hello World!"', () => {
      expect(menusController.getHello()).toBe('Hello World!');
    });
  });
});
