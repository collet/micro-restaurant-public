import { firstValueFrom } from 'rxjs';
import { AxiosResponse } from 'axios';
import { Injectable } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { ConfigService } from '@nestjs/config';

import { DependenciesConfig } from '../../shared/config/interfaces/dependencies-config.interface';

import { OrderingLine } from '../schemas/ordering-line.schema';
import { ItemToBeCookedDto } from '../dto/item-to-be-cooked.dto';
import { CookedItemDto } from '../dto/cooked-item.dto';

@Injectable()
export class KitchenProxyService {
  private _baseUrl: string;

  private _cookedItemsPath = '/cookedItems';

  constructor(private configService: ConfigService, private readonly httpService: HttpService) {
    const dependenciesConfig = this.configService.get<DependenciesConfig>('dependencies');
    this._baseUrl = `http://${dependenciesConfig.kitchen_service_url_with_port}`;
  }

  async sendItemsToCook(orderingLine: OrderingLine): Promise<CookedItemDto[]> {
    const itemToBeCooked: ItemToBeCookedDto = ItemToBeCookedDto.itemToBeCookedDtoFactory(orderingLine);
    const sendItemsToCookCallResponse: AxiosResponse<CookedItemDto[]> = await firstValueFrom(this.httpService.post(`${this._baseUrl}${this._cookedItemsPath}`, itemToBeCooked));

    return sendItemsToCookCallResponse.data;
  }
}
