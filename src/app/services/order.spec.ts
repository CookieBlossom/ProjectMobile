import { Order } from './order';

describe('Order', () => {
  it('should create an instance', () => {
    const order = new Order(
      1,                // idorder
      new Date(),       // created_at
      1000,             // totalorder
      101,              // idproduct
      0,                // idcomplaint
      '12345678-9'      // rut
    );
    expect(order).toBeTruthy();
  });
});
