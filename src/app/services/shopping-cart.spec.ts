import { ShoppingCart } from './shopping-cart';

describe('ShoppingCart', () => {
  it('should create an instance', () => {
    const shoppingCart = new ShoppingCart(1, '12345678-9'); // Proporciona los valores necesarios
    expect(shoppingCart).toBeTruthy();
  });
});
