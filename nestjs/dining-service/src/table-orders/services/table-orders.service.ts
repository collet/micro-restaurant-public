import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

import { Table } from '../../tables/schemas/table.schema';
import { TableOrder, TableOrderDocument } from '../schemas/table-order.schema';
import { OrderingItem } from '../schemas/ordering-item.schema';
import { OrderingLine } from '../schemas/ordering-line.schema';

import { StartOrderingDto } from '../dto/start-ordering.dto';
import { AddMenuItemDto } from '../dto/add-menu-item.dto';
import { PreparationDto } from '../dto/preparation.dto';

import { OrderingLinesWithPreparations } from '../interfaces/ordering-lines-with-preparations.interface';

import { TablesService } from '../../tables/services/tables.service';
import { MenuProxyService } from './menu-proxy.service';
import { KitchenProxyService } from './kitchen-proxy.service';

import { TableOrderIdNotFoundException } from '../exceptions/table-order-id-not-found.exception';
import { AddMenuItemDtoNotFoundException } from '../exceptions/add-menu-item-dto-not-found.exception';
import { TableOrderAlreadyBilledException } from '../exceptions/table-order-already-billed.exception';

@Injectable()
export class TableOrdersService {
  constructor(
    @InjectModel(TableOrder.name) private tableOrderModel: Model<TableOrderDocument>,
    private readonly tablesService: TablesService,
    private readonly menuProxyService: MenuProxyService,
    private readonly kitchenProxyService: KitchenProxyService,
  ) {}

  async findAll(): Promise<TableOrder[]> {
    return this.tableOrderModel.find().lean();
  }

  async findOne(tableOrderId: string): Promise<TableOrder> {
    const foundItem = await this.tableOrderModel.findOne({ _id: tableOrderId }).lean();

    if (foundItem === null) {
      throw new TableOrderIdNotFoundException(tableOrderId);
    }

    return foundItem;
  }

  async startOrdering(startOrderingDto: StartOrderingDto): Promise<TableOrder> {
    const table: Table = await this.tablesService.takeTable(startOrderingDto.tableNumber);

    const tableOrder: TableOrder = new TableOrder();
    tableOrder.tableNumber = table.number;
    tableOrder.customersCount = startOrderingDto.customersCount;
    tableOrder.opened = new Date();

    return await this.tableOrderModel.create(tableOrder);
  }

  async addOrderingLineToTableOrder(tableOrderId: string, addMenuItemDto: AddMenuItemDto): Promise<TableOrder> {
    const tableOrder: TableOrder = await this.findOne(tableOrderId);

    if (tableOrder.billed !== null) {
      throw new TableOrderAlreadyBilledException(tableOrder);
    }

    const orderingItem: OrderingItem = await this.menuProxyService.findByShortName(addMenuItemDto.menuItemShortName);

    if (orderingItem === null) {
      throw new AddMenuItemDtoNotFoundException(addMenuItemDto);
    }

    if (addMenuItemDto.menuItemId !== orderingItem._id) {
      throw new AddMenuItemDtoNotFoundException(addMenuItemDto);
    }

    const orderingLine: OrderingLine = new OrderingLine();
    orderingLine.item = orderingItem;
    orderingLine.howMany = addMenuItemDto.howMany;

    return this.tableOrderModel.findByIdAndUpdate(
      tableOrder._id,
      { $push: { lines: orderingLine } },
      { returnDocument: 'after' },
    );
  }

  async manageOrderingLines(tableNumber: number, orderingLines: OrderingLine[]): Promise<OrderingLinesWithPreparations> {
    let orderingLinesToSend: OrderingLine[] = [];

    const newOrderingLines: OrderingLine[] = orderingLines.map((orderingLine) => {
      if (!orderingLine.sentForPreparation) {
        orderingLinesToSend.push(orderingLine);
        orderingLine.sentForPreparation = true;
      }

      return orderingLine;
    });

    const preparations: PreparationDto[] = await this.kitchenProxyService.sendItemsToCook(tableNumber, orderingLinesToSend);

    return {
      orderingLines: newOrderingLines,
      preparations,
    };
  };

  async sendItemsForPreparation(tableOrderId: string): Promise<PreparationDto[]> {
    const tableOrder: TableOrder = await this.findOne(tableOrderId);

    if (tableOrder.billed !== null) {
      throw new TableOrderAlreadyBilledException(tableOrder);
    }

    const managedLines: OrderingLinesWithPreparations = await this.manageOrderingLines(tableOrder.tableNumber, tableOrder.lines);

    tableOrder.lines = managedLines.orderingLines;

    await this.tableOrderModel.findByIdAndUpdate(tableOrder._id, tableOrder, { returnDocument: 'after' });

    return managedLines.preparations;
  }

  async billOrder(tableOrderId: string): Promise<TableOrder> {
    const tableOrder: TableOrder = await this.findOne(tableOrderId);

    if (tableOrder.billed !== null) {
      throw new TableOrderAlreadyBilledException(tableOrder);
    }

    tableOrder.billed = new Date();

    // TODO: Send payment for the table order

    // TODO: Move next line when billing is managed
    await this.tablesService.releaseTable(tableOrder.tableNumber);

    return this.tableOrderModel.findByIdAndUpdate(tableOrder._id, tableOrder, { returnDocument: 'after' });
  }
}
