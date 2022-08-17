import { ApiProperty } from '@nestjs/swagger';

export class OrderingItem {
  @ApiProperty()
  _id: string; // id of the item from the menu

  @ApiProperty()
  shortName: string;

  constructor(anyObject: any = {}) {
    this._id = anyObject._id || null;
    this.shortName = anyObject.shortName || null;
  }
}
