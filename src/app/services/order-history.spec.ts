import { OrderHistory } from './order-history';

describe('OrderHistory', () => {
  it('should create an instance', () => {
    const orderHistory = new OrderHistory(1, 101, '12345678-9', 1, new Date()); // Proporcionar valores válidos
    expect(orderHistory).toBeTruthy();
  });
});
