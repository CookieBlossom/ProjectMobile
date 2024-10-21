export class Favoriteslist {
  idlist!: number;
  rut!: string;
  list_name!: string;
  constructor(idlist: number,rut: string, list_name: string){
    this.idlist = idlist;
    this.rut = rut;
    this.list_name = list_name;
  }
}
