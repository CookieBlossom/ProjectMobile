import { CartItem } from './cart-item';

describe('CartItem', () => {
  it('should create an instance', () => {
    const cartItem = new CartItem(1, 2, 3, 4, 5); // Proporcionar los valores requeridos
    expect(cartItem).toBeTruthy();
  });
});
