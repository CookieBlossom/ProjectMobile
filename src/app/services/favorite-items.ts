export class FavoriteItems {
  idfavorite_item!:number;
  idlist!:number;
  idproduct!:number;
  constructor(idfavorite_item:number, idlist:number, idproduct: number){
    this.idfavorite_item = idfavorite_item;
    this.idlist = idlist;
    this.idproduct = idproduct
  }
}
