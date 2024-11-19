import { ProductSizes } from './product-sizes';

describe('ProductSizes', () => {
  it('should create an instance', () => {
    const productSize = new ProductSizes(
      1, // idproduct_size
      101, // idproduct
      42 // idsize
    );
    expect(productSize).toBeTruthy();
  });
});
