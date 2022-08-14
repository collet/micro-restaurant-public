import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import {
  ApiBody,
  ApiConflictResponse,
  ApiCreatedResponse,
  ApiNotFoundResponse, ApiOkResponse,
  ApiParam,
  ApiTags
} from '@nestjs/swagger';

import { AddMenuItemDto } from '../dto/add-menu-item.dto';
import { GetMenuItemParams } from '../params/get-menu-item.params';

import { MenuItem } from '../schemas/menu-item.schema';

import { MenuItemShortNameAlreadyExistsException } from '../exceptions/menu-item-short-name-already-exists.exception';

import { MenusService } from '../services/menus.service';
import { MenuItemIdNotFoundException } from '../exceptions/menu-item-id-not-found.exception';

@ApiTags('menus')
@Controller('/menus')
export class MenusController {
  constructor(private readonly menusService: MenusService) {}

  @Get()
  @ApiOkResponse({ type: MenuItem, isArray: true })
  async getFullMenu(): Promise<MenuItem[]> {
    return this.menusService.findAll();
  }

  @ApiParam({ name: 'menuItemId' })
  @Get(':menuItemId')
  @ApiOkResponse({ type: MenuItem })
  @ApiNotFoundResponse({ type: MenuItemIdNotFoundException, description: 'MenuItem not found' })
  async getMenuItem(@Param() getMenuItemParams: GetMenuItemParams): Promise<MenuItem> {
    return this.menusService.findOne(getMenuItemParams.menuItemId);
  }

  @ApiBody({ type: AddMenuItemDto })
  @Post()
  @ApiCreatedResponse({ description: 'The menu item has been successfully added.', type: MenuItem })
  @ApiConflictResponse({ type: MenuItemShortNameAlreadyExistsException, description: 'Menu short name already exists' })
  async addMenuItem(@Body() addMenuItemDto: AddMenuItemDto) {
    return await this.menusService.create(addMenuItemDto);
  }
}
