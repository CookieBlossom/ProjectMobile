import { FavoriteItems } from './favorite-items';

describe('FavoriteItems', () => {
  it('should create an instance', () => {
    const favoriteItem = new FavoriteItems(1, 2, 3); // Proporcionar valores para el constructor
    expect(favoriteItem).toBeTruthy();
  });
});
