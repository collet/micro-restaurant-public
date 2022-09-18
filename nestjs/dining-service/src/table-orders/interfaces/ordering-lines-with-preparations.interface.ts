import { OrderingLine } from '../schemas/ordering-line.schema';
import { PreparationDto } from '../dto/preparation.dto';

export interface OrderingLinesWithPreparations {
  orderingLines: OrderingLine[];

  preparations: PreparationDto[];
}
