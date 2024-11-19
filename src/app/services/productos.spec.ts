import { Productos } from './productos';

describe('Productos', () => {
  it('should create an instance', () => {
    const producto = new Productos(
      1, // idproduct
      'Zapato Deportivo', // nameproduct
      'Un zapato para correr cómodo y ligero.', // descriptionproduct
      50, // stockproduct
      2, // idcategory
      3, // idbrand
      1, // idgender
      'image.jpg', // image (puedes usar un string o un objeto según lo que necesites)
      'Available', // status
      49990 // priceproduct
    );
    expect(producto).toBeTruthy();
  });
});
