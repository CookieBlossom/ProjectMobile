export class CartItem {
  idcart_item!: number; // Se agrega el idcart_item como opcional
  idcart!: number;
  idproduct!: number;
  quantity!: number;
  size!: number;

  constructor(idcart: number, idproduct: number, quantity: number, size: number, idcart_item: number) {
    this.idcart = idcart;
    this.quantity = quantity;
    this.size = size;
    this.idproduct = idproduct;
    this.idcart_item = idcart_item;
  }
}
