import { Body, Controller, Get, HttpCode, Param, Post, Query } from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiBody,
  ApiCreatedResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiParam,
  ApiQuery,
  ApiTags,
  ApiUnprocessableEntityResponse
} from '@nestjs/swagger';

import { ItemToBeCookedDto } from '../dto/item-to-be-cooked.dto';
import { CookedItemDto } from '../dto/cooked-item.dto';

import { CookedItem } from '../schemas/cooked-item.schema';
import { CookStateEnum } from '../schemas/cook-state-enum.schema';

import { CookStateQueryParams } from '../params/cook-state.query-params';
import { CookedItemIdParams } from '../params/cooked-item-id.params';

import { CookedItemsService } from '../services/cooked-items.service';

import { WrongQueryParameterException } from '../exceptions/wrong-query-parameter.exception';
import { ItemToBeCookedNotFoundException } from '../exceptions/item-to-be-cooked-not-found.exception';
import { CookedItemIdNotFoundException } from '../exceptions/cooked-item-id-not-found.exception';
import {
  CookedItemAlreadyTakenFromKitchenException
} from '../exceptions/cooked-item-already-taken-from-kitchen.exception';
import { CookedItemNotReadyInKitchenYetException } from '../exceptions/cooked-item-not-ready-in-kitchen-yet.exception';

@ApiTags('cookedItems')
@Controller('/cookedItems')
export class CookedItemsController {
  constructor(private readonly cookedItemsService: CookedItemsService) {}

  @ApiBody({ type: ItemToBeCookedDto })
  @ApiCreatedResponse({ type: CookedItemDto, isArray: true, description: 'The items have been sent to cook.' })
  @ApiNotFoundResponse({ type: ItemToBeCookedNotFoundException, description: 'Item to be cooked is not known by the kitchen.' })
  @Post()
  async sendItemsToCook(@Body() itemToBeCookedDto: ItemToBeCookedDto): Promise<CookedItemDto[]> {
    const cookedItems: CookedItem[] = await this.cookedItemsService.cookItems(itemToBeCookedDto);

    return CookedItemDto.cookedItemDTOFactoryList(cookedItems);
  }

  @ApiQuery({ name: 'state', enum: CookStateEnum })
  @ApiOkResponse({ type: CookedItemDto, isArray: true, description: 'The items have been sent to cook.' })
  @ApiBadRequestResponse({ type: WrongQueryParameterException, description: 'State in params is not a valid cook state.' })
  @Get()
  async getCookedItemsByCookState(@Query() cookStateQueryParams: CookStateQueryParams): Promise<CookedItemDto[]> {
    const cookedItems: CookedItem[] = await this.cookedItemsService.findByCookState(cookStateQueryParams.state);

    return CookedItemDto.cookedItemDTOFactoryList(cookedItems);
  }

  @ApiParam({ name: 'cookedItemId' })
  @ApiOkResponse({ type: CookedItemDto, description: 'The item has been successfully declared as brought to the table.' })
  @ApiNotFoundResponse({ type: CookedItemIdNotFoundException, description: 'Cooked Item not found' })
  @ApiUnprocessableEntityResponse({ type: CookedItemAlreadyTakenFromKitchenException, description: 'CookedItem already taken from the kitchen' })
  @ApiUnprocessableEntityResponse({ type: CookedItemNotReadyInKitchenYetException, description: 'CookedItem not yet ready in the kitchen' })
  @HttpCode(200)
  @Post(':cookedItemId/takenToTable')
  async itemIsServed(@Param() cookedItemIdParams: CookedItemIdParams): Promise<CookedItemDto> {
    const cookedItem: CookedItem = await this.cookedItemsService.isTakenForService(cookedItemIdParams.cookedItemId);

    return CookedItemDto.cookedItemDTOFactory(cookedItem);
  }
}
