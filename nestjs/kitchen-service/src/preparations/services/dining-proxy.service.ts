import { firstValueFrom } from 'rxjs';
import { AxiosResponse } from 'axios';
import { Injectable } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { ConfigService } from '@nestjs/config';
import * as _keyBy from 'lodash/keyBy';

import { DependenciesConfig } from '../../shared/config/interfaces/dependencies-config.interface';

import { Table } from '../schemas/table.schema';

@Injectable()
export class DiningProxyService {
  private _baseUrl: string;

  private _tablesPath = '/tables';

  private _tablesByNumber: Map<string, Table> = null;

  constructor(private configService: ConfigService, private readonly httpService: HttpService) {
    const dependenciesConfig = this.configService.get<DependenciesConfig>('dependencies');
    this._baseUrl = `http://${dependenciesConfig.dining_service_url_with_port}`;
  }

  private async retrieveAllTables() {
    if (this._tablesByNumber === null) {
      const retrieveAllTablesCallResponse: AxiosResponse<Table[]> = await firstValueFrom(this.httpService.get(`${this._baseUrl}${this._tablesPath}`));
      this._tablesByNumber = _keyBy(retrieveAllTablesCallResponse.data, 'number');
    }
  }

  async isTableNumberValid(tableNumber: number): Promise<Boolean> {
    await this.retrieveAllTables();
    const table: Table = this._tablesByNumber[tableNumber] || null;

    return table !== null;
  }
}
