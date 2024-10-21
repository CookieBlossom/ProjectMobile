export class ShoppingCart {
  idcart!: number;
  rut!: string;
  constructor(idcart: number, rut: string) {
    this.idcart = idcart;
    this.rut = rut;
  }
}
