import { Favoriteslist } from './favoriteslist';

describe('Favoriteslist', () => {
  it('should create an instance', () => {
    const favoriteslist = new Favoriteslist(1, '12345678-9', 'Lista de Favoritos'); // Proporcionar valores válidos
    expect(favoriteslist).toBeTruthy();
  });
});
