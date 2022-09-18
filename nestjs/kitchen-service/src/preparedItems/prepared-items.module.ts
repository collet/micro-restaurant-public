import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { PreparedItem, PreparedItemSchema } from './schemas/prepared-item.schema';

import { PreparedItemsController } from './controllers/prepared-items.controller';
import { PreparedItemsService } from './services/prepared-items.service';

import { KitchenFacadeModule } from '../kitchenFacade/kitchen-facade.module';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: PreparedItem.name, schema: PreparedItemSchema },
    ]),
    KitchenFacadeModule,
  ],
  controllers: [PreparedItemsController],
  providers: [PreparedItemsService],
})
export class PreparedItemsModule {}
