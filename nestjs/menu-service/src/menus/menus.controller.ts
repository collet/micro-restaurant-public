import { Controller, Get } from '@nestjs/common';

import { MenusService } from './menus.service';
import { MenuItem } from './schemas/menu-item.schema';

@Controller('/menus')
export class MenusController {
  constructor(private readonly menusService: MenusService) {}

  @Get()
  async getFullMenu(): Promise<MenuItem[]> {
    return this.menusService.getFullMenu();
  }
}
