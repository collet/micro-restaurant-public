import { IsBoolean, IsMongoId, IsNotEmpty, IsOptional, IsPositive } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

import { TableOrder } from '../../table-orders/schemas/table-order.schema';
import { Table } from '../../tables/schemas/table.schema';

export class TableWithOrderDto {
  @ApiProperty()
  @IsMongoId()
  _id: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsPositive()
  number: number;

  @ApiProperty()
  @IsNotEmpty()
  @IsBoolean()
  taken: boolean;

  @ApiProperty()
  @IsMongoId()
  @IsOptional()
  tableOrderId: string; // could be null (is null if taken === false)
  // could also be complemented with more information on the order itself, here as a MVP, we only add the id
  // forcing for a callback to the API to get the information

  static tableWithOrderDtoFactory(table: Table, tableOrder: TableOrder): TableWithOrderDto {
    const tableWithOrderDto: TableWithOrderDto = new TableWithOrderDto();
    tableWithOrderDto._id = table._id;
    tableWithOrderDto.number = table.number;
    tableWithOrderDto.taken = table.taken;
    tableWithOrderDto.tableOrderId = tableOrder?._id || null;

    return tableWithOrderDto;
  }
}
