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
  ApiUnprocessableEntityResponse,
} from '@nestjs/swagger';

import { PreparationRequestDto } from '../dto/preparation-request.dto';

import { PreparationStateEnum } from '../schemas/preparation-state-enum.schema';
import { Preparation } from '../schemas/preparation.schema';

import { StateTableNumberQueryParams } from '../params/state-table-number.query-params';
import { PreparationIdParams } from '../params/preparation-id.params';

import { PreparationsService } from '../services/preparations.service';

import { TableNumberNotFoundException } from '../exceptions/table-number-not-found.exception';
import { WrongQueryParameterException } from '../exceptions/wrong-query-parameter.exception';
import { EmptyItemsToBeCookedSentInKitchenException } from '../exceptions/empty-items-to-be-cooked-sent-in-kitchen.exception';
import { ItemsToBeCookedNotFoundException } from '../exceptions/items-to-be-cooked-not-found.exception';
import { RecipeNotFoundException } from '../../kitchenFacade/exceptions/recipe-not-found.exception';
import { PreparationIdNotFoundException } from '../exceptions/preparation-id-not-found.exception';
import { PreparationNotReadyInKitchenException } from '../exceptions/preparation-not-ready-in-kitchen.exception';
import { PreparationAlreadyTakenFromKitchenException } from '../exceptions/preparation-already-taken-from-kitchen.exception';

@ApiTags('Preparations')
@Controller('/preparations')
export class PreparationsController {
  constructor(private readonly preparationsService: PreparationsService) {}

  @ApiQuery({ name: 'state', enum: PreparationStateEnum })
  @ApiQuery({ name: 'tableNumber', required: false })
  @ApiOkResponse({ type: Preparation, isArray: true, description: 'The preparations filtered by state and/or table number.' })
  @ApiNotFoundResponse({ type: TableNumberNotFoundException, description: 'Table number in params is not a valid table number.' })
  @ApiBadRequestResponse({ type: WrongQueryParameterException, description: 'State in params is not a valid preparation state.' })
  @Get()
  async getAllPreparationsByStateAndTableNumber(@Query() stateTableNumberQueryParams: StateTableNumberQueryParams): Promise<Preparation[]> {
    return await this.preparationsService.findByStateAndTableNumber(stateTableNumberQueryParams.state, stateTableNumberQueryParams.tableNumber);
  }

  @ApiBody({ type: PreparationRequestDto })
  @ApiCreatedResponse({ type: Preparation, isArray: true, description: 'The new preparations corresponding to items sent to cook.' })
  @ApiNotFoundResponse({ type: TableNumberNotFoundException, description: 'Table number in params is not a valid table number.' })
  @ApiNotFoundResponse({ type: RecipeNotFoundException, description: 'Recipe not found for menu item.' })
  @ApiUnprocessableEntityResponse({ type: EmptyItemsToBeCookedSentInKitchenException, description: 'Empty item list sent to the kitchen' })
  @ApiUnprocessableEntityResponse({ type: ItemsToBeCookedNotFoundException, description: 'Some item names not found by the kitchen' })
  @Post()
  async requestNewPreparation(@Body() preparationRequestDto: PreparationRequestDto): Promise<Preparation[]> {
    return await this.preparationsService.cookItems(preparationRequestDto);
  }

  @ApiParam({ name: 'preparationId' })
  @ApiOkResponse({ type: Preparation, description: 'The searched preparation.' })
  @ApiNotFoundResponse({ type: PreparationIdNotFoundException, description: 'Preparation Id not found.' })
  @Get(':preparationId')
  async retrievePreparation(@Param() preparationIdParams: PreparationIdParams): Promise<Preparation> {
    return await this.preparationsService.findPreparationById(preparationIdParams.preparationId);
  }

  @ApiParam({ name: 'preparationId' })
  @ApiOkResponse({ type: Preparation, description: 'The preparation has been successfully declared as brought to the table.' })
  @ApiNotFoundResponse({ type: PreparationIdNotFoundException, description: 'Preparation Id not found.' })
  @ApiUnprocessableEntityResponse({ type: PreparationNotReadyInKitchenException, description: 'Preparation not yet ready in the kitchen' })
  @ApiUnprocessableEntityResponse({ type: PreparationAlreadyTakenFromKitchenException, description: 'Preparation already taken from the kitchen' })
  @HttpCode(200)
  @Post(':preparationId/takenToTable')
  async preparationIsServed(@Param() preparationIdParams: PreparationIdParams): Promise<Preparation> {
    // declaration by the waiter that the preparation is brought to the table
    return await this.preparationsService.isTakenForService(preparationIdParams.preparationId);
  }
}
