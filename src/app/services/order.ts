export class Order {
  idorder!: number;
  created_at!: any;
  totalorder!: number;
  idproduct!: number;
  idcard!: number;
  idcomplaint!: number;
  rut!: string;
  constructor(idorder: number, created_at: any,totalorder: number,idproduct: number,idcard: number,idcomplaint: number,rut: string,){
    this.idorder = idorder;
    this.created_at =created_at;
    this.totalorder = totalorder;
    this.idproduct = idproduct;
    this.idcard = idcard;
    this.idcomplaint = idcomplaint;
    this.rut = rut;
  }
}
