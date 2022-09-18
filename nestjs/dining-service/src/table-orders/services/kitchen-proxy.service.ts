import { firstValueFrom } from 'rxjs';
import { AxiosResponse } from 'axios';
import { Injectable } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { ConfigService } from '@nestjs/config';

import { DependenciesConfig } from '../../shared/config/interfaces/dependencies-config.interface';

import { OrderingLine } from '../schemas/ordering-line.schema';
import { ItemToBeCookedDto } from '../dto/item-to-be-cooked.dto';
import { PreparationDto } from '../dto/preparation.dto';

@Injectable()
export class KitchenProxyService {
  private _baseUrl: string;

  private _preparationsPath = '/preparations';

  constructor(private configService: ConfigService, private readonly httpService: HttpService) {
    const dependenciesConfig = this.configService.get<DependenciesConfig>('dependencies');
    this._baseUrl = `http://${dependenciesConfig.kitchen_service_url_with_port}`;
  }

  async sendItemsToCook(tableNumber: number, orderingLines: OrderingLine[]): Promise<PreparationDto[]> {
    const itemsToBeCooked: ItemToBeCookedDto[] = orderingLines.map((orderingLine) => (ItemToBeCookedDto.itemToBeCookedDtoFactory(orderingLine)));
    try {
      const preparationRequest = {
        tableNumber,
        itemsToBeCooked,
      };
      const sendItemsToCookCallResponse: AxiosResponse<PreparationDto[]> = await firstValueFrom(this.httpService.post(`${this._baseUrl}${this._preparationsPath}`, preparationRequest));

      return sendItemsToCookCallResponse.data.map((preparation) => PreparationDto.kitchenPreparationToPreparationDtoFactory(preparation));
    } catch (e) {
      /* istanbul ignore next */
      console.error('Error happened');
      /* istanbul ignore next */
      console.error(e);
    }
  }
}
