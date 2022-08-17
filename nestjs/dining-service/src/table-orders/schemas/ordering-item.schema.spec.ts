import { OrderingItem } from './ordering-item.schema';

describe('OrderingItem', () => {
  it ('build the right ordering item from any object', () => {
    const emptyObject = {};
    const emptyOrderingItem: OrderingItem = {
      _id: null,
      shortName: null,
    };

    expect(new OrderingItem()).toEqual(emptyOrderingItem);
    expect(new OrderingItem(emptyObject)).toEqual(emptyOrderingItem);

    const anObject = {
      _id: 'item id',
      shortName: 'item shortName',
      anotherProp: 'anotherValue',
    };
    const anObjectOrderingItem: OrderingItem = {
      _id: 'item id',
      shortName: 'item shortName',
    };
    expect(new OrderingItem(anObject)).toEqual(anObjectOrderingItem);
  })
});
