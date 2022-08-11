import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { ApiBody, ApiParam, ApiTags } from '@nestjs/swagger';

import { AddMenuItemDto } from './dto/add-menu-item.dto';
import { GetMenuItemParams } from './params/get-menu-item.params';

import { MenuItem } from './schemas/menu-item.schema';

import { MenusService } from './menus.service';

@ApiTags('menus')
@Controller('/menus')
export class MenusController {
  constructor(private readonly menusService: MenusService) {}

  @Get()
  async getFullMenu(): Promise<MenuItem[]> {
    return this.menusService.findAll();
  }

  @ApiParam({ name: 'menuItemId' })
  @Get(':menuItemId')
  async getMenuItem(@Param() getMenuItemParams: GetMenuItemParams): Promise<MenuItem> {
    return this.menusService.findOne(getMenuItemParams.menuItemId);
  }

  @ApiBody({ type: AddMenuItemDto })
  @Post()
  async addMenuItem(@Body() addMenuItemDto: AddMenuItemDto) {
    await this.menusService.create(addMenuItemDto);
  }
}
