export class CartItem {
  idcart!:number;
  idproduct!:number;
  quantity!: number;
  size!:number;
  constructor(idcart: number, idproduct: number, quantity: number, size:number){
    this.idcart = idcart;
    this.quantity = quantity;
    this.size = size;
    this.idproduct = idproduct;
  }
}
// tableCartItem: string = `
// CREATE TABLE IF NOT EXISTS cart_item (
//   idcart_item INTEGER PRIMARY KEY AUTOINCREMENT,
//   idcart INTEGER NOT NULL,
//   idproduct INTEGER NOT NULL,
//   FOREIGN KEY (idcart) REFERENCES shopping_cart(idcart),
//   FOREIGN KEY (idproduct) REFERENCES product(idproduct)
// );`;
