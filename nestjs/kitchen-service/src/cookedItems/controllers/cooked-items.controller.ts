import { Body, Controller, Post } from '@nestjs/common';
import {
  ApiBody,
  ApiCreatedResponse,
  ApiNotFoundResponse,
  ApiTags
} from '@nestjs/swagger';

import { ItemToBeCookedDto } from '../dto/item-to-be-cooked.dto';
import { CookedItemDto } from '../dto/cooked-item.dto';

import { CookedItem } from '../schemas/cooked-item.schema';

import { ItemToBeCookedNotFoundException } from '../exceptions/item-to-be-cooked-not-found.exception';

import { CookedItemsService } from '../services/cooked-items.service';

@ApiTags('cookedItems')
@Controller('/cookedItems')
export class CookedItemsController {
  constructor(private readonly cookedItemsService: CookedItemsService) {}

  @ApiBody({ type: ItemToBeCookedDto })
  @ApiCreatedResponse({ type: CookedItemDto, isArray: true, description: 'The items have been sent to cook.' })
  @ApiNotFoundResponse({ type: ItemToBeCookedNotFoundException, description: 'Item to be cooked is not known by the kitchen.' })
  @Post()
  async sendItemsToCook(@Body() itemToBeCookedDto: ItemToBeCookedDto) {
    const cookedItems: CookedItem[] = await this.cookedItemsService.cookItems(itemToBeCookedDto);

    return CookedItemDto.cookedItemDTOFactoryList(cookedItems);
  }
}
