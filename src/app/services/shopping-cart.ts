export class ShoppingCart {
  idcart!: number;
  rut!: string;
  totalcart!: number;

  constructor(idcart: number, rut: string, totalcart: number) {
    this.idcart = idcart;
    this.rut = rut;
    this.totalcart = totalcart;
  }
}
