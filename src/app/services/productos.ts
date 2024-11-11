export class Productos {
    idproduct!: number;
    nameproduct!: string;
    descriptionproduct!: string;
    stockproduct!: number;
    idcategory!: number;
    idbrand!: number;
    idgender!: number;
    image!: any;
    status!: string;
    priceproduct!: number;
    constructor(
      idproduct: number,
      nameproduct: string,
      descriptionproduct: string,
      stockproduct: number,
      idcategory: number,
      idbrand: number,
      idgender: number,
      image: any,
      status: string,
      priceproduct: number){
      this.idproduct = idproduct;
      this.nameproduct = nameproduct;
      this.descriptionproduct = descriptionproduct;
      this.stockproduct = stockproduct;
      this.idcategory = idcategory;
      this.idbrand = idbrand;
      this.idgender = idgender;
      this.image = image;
      this.status = status;
      this.priceproduct = priceproduct;
    }
  }
