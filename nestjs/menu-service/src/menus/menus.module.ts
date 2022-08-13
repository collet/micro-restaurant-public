import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { MenuItem, MenuItemSchema } from './schemas/menu-item.schema';

import { MenusController } from './controllers/menus.controller';
import { MenusService } from './services/menus.service';

@Module({
  imports: [MongooseModule.forFeature([{ name: MenuItem.name, schema: MenuItemSchema }])],
  controllers: [MenusController],
  providers: [MenusService],
})
export class MenusModule {}
