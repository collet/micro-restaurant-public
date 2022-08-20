import { OrderingLine } from '../schemas/ordering-line.schema';
import { CookedItemDto } from '../dto/cooked-item.dto';

export interface OrderingLineWithCookedItems {
  orderingLine: OrderingLine;

  cookedItems: CookedItemDto[];
}
