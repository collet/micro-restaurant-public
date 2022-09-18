import { Body, Controller, Get, HttpCode, Param, Post, Query } from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiBody,
  ApiCreatedResponse, ApiNotFoundResponse,
  ApiOkResponse,
  ApiParam,
  ApiQuery,
  ApiTags, ApiUnprocessableEntityResponse,
} from '@nestjs/swagger';

import { PreparedItem } from '../schemas/prepared-item.schema';
import { Recipe } from '../../shared/schemas/recipe.schema';
import { PostEnum } from '../../shared/schemas/post-enum.schema';

import { PreparedItemIdParams } from '../params/prepared-item-id.params';
import { PostQueryParams } from '../params/post.query-params';

import { PreparedItemsService } from '../services/prepared-items.service';

import { PreparedItemIdNotFoundException } from '../exceptions/prepared-item-id-not-found.exception';
import { ItemAlreadyStartedToBeCookedException } from '../exceptions/item-already-started-to-be-cooked.exception';
import { ItemNotStartedToBeCookedException } from '../exceptions/item-not-started-to-be-cooked.exception';
import { ItemAlreadyFinishedToBeCookedException } from '../exceptions/item-already-finished-to-be-cooked.exception';

@ApiTags('Prepared Items')
@Controller('/preparedItems')
export class PreparedItemsController {
  constructor(private readonly preparedItemsService: PreparedItemsService) {}

  @ApiParam({ name: 'preparedItemId' })
  @ApiOkResponse({ type: PreparedItem, description: 'The searched prepared item.' })
  @ApiNotFoundResponse({ type: PreparedItemIdNotFoundException, description: 'Prepared Item Id not found.' })
  @Get(':preparedItemId')
  async retrievePreparedItem(@Param() preparedItemIdParams: PreparedItemIdParams): Promise<PreparedItem> {
    return await this.preparedItemsService.findPreparedItemById(preparedItemIdParams.preparedItemId);
  }

  @ApiParam({ name: 'preparedItemId' })
  @ApiOkResponse({ type: Recipe, description: 'The searched prepared item\'s recipe.' })
  @ApiNotFoundResponse({ type: PreparedItemIdNotFoundException, description: 'Prepared Item Id not found.' })
  @Get(':preparedItemId/recipe')
  async retrievePreparedItemRecipe(@Param() preparedItemIdParams: PreparedItemIdParams): Promise<Recipe> {
    const preparedItem: PreparedItem = await this.preparedItemsService.findPreparedItemById(preparedItemIdParams.preparedItemId);

    return preparedItem.recipe;
  }

  @ApiQuery({ name: 'post', enum: PostEnum })
  @ApiOkResponse({ type: PreparedItem, isArray: true, description: 'All items to start cooking now for the requested post.' })
  @Get()
  async getPreparatedItemsToStartByPost(@Query() postQueryParams: PostQueryParams): Promise<PreparedItem[]> {
    return await this.preparedItemsService.getAllItemsToStartCookingNow(postQueryParams.post);
  }

  @ApiParam({ name: 'preparedItemId' })
  @ApiOkResponse({ type: PreparedItem, description: 'The started prepared item.' })
  @ApiNotFoundResponse({ type: PreparedItemIdNotFoundException, description: 'Prepared Item Id not found.' })
  @ApiUnprocessableEntityResponse({ type: ItemAlreadyStartedToBeCookedException, description: 'Item already started cooking inside the kitchen' })
  @HttpCode(200)
  @Post(':preparedItemId/start')
  async startToPrepareItemOnPost(@Param() preparedItemIdParams: PreparedItemIdParams): Promise<PreparedItem> {
    return await this.preparedItemsService.startCookingItem(preparedItemIdParams.preparedItemId);
  }

  @ApiParam({ name: 'preparedItemId' })
  @ApiOkResponse({ type: PreparedItem, description: 'The finished prepared item.' })
  @ApiNotFoundResponse({ type: PreparedItemIdNotFoundException, description: 'Prepared Item Id not found.' })
  @ApiUnprocessableEntityResponse({ type: ItemNotStartedToBeCookedException, description: 'Item not started to be cooked inside the kitchen' })
  @ApiUnprocessableEntityResponse({ type: ItemAlreadyFinishedToBeCookedException, description: 'Item already finished of being cooked in the kitchen' })
  @HttpCode(200)
  @Post(':preparedItemId/finish')
  async finishToPrepareItemOnPost(@Param() preparedItemIdParams: PreparedItemIdParams): Promise<PreparedItem> {
    return await this.preparedItemsService.finishCookingItem(preparedItemIdParams.preparedItemId);
  }
}
