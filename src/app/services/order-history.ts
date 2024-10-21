export class OrderHistory {
  idhistory!: number;
  idorder!: any;
  rut!: string;
  idstate!: number;
  change_date!: any;
  constructor(idhistory: number, idorder: any, rut: string, idstate:number, change_date:any){
    this.idhistory = idhistory;
    this.idorder =idorder;
    this.rut = rut;
    this.idstate = idstate;
    this.change_date = change_date;
  }
}
