import { firstValueFrom } from 'rxjs';
import { AxiosResponse } from 'axios';
import { Injectable } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { ConfigService } from '@nestjs/config';
import * as _keyBy from 'lodash/keyBy';

import { DependenciesConfig } from '../../shared/config/interfaces/dependencies-config.interface';

import { MenuItem } from '../schemas/menu-item.schema';
import { OrderingItem } from '../schemas/ordering-item.schema';

@Injectable()
export class MenuProxyService {
  private _baseUrl: string;

  private _menusPath = '/menus';

  private _menuItemsByShortName: Map<string, MenuItem> = null;

  constructor(private configService: ConfigService, private readonly httpService: HttpService) {
    const dependenciesConfig = this.configService.get<DependenciesConfig>('dependencies');
    this._baseUrl = `http://${dependenciesConfig.menu_service_url_with_port}`;
  }

  private async retrieveFullMenu() {
    if (this._menuItemsByShortName === null) {
      const retrieveFullMenuCallResponse: AxiosResponse<MenuItem[]> = await firstValueFrom(this.httpService.get(`${this._baseUrl}${this._menusPath}`));
      this._menuItemsByShortName = _keyBy(retrieveFullMenuCallResponse.data, 'shortName');
    }
  }

  async findByShortName(menuItemShortName: string): Promise<OrderingItem> {
    await this.retrieveFullMenu();
    let menuItem: MenuItem = this._menuItemsByShortName[menuItemShortName] || null;

    let orderingItem: OrderingItem = null;

    if (menuItem !== null) {
      orderingItem = new OrderingItem(menuItem);
    }

    return orderingItem;
  }
}
