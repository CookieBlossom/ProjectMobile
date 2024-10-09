export class Productos {
    idproduct!: number;           // ID único del producto
    nameproduct!: string;         // Nombre del producto
    descriptionproduct!: string;  // Descripción del producto
    stockproduct!: number;        // Cantidad de stock disponible del producto
    idcategory!: number;          // ID de la categoría del producto
    idbrand!: number;             // ID de la marca del producto
    idgender!: number;            // ID del género del producto
    image!: any;                  // Imagen del producto, se usa 'any' ya que es un BLOB
    priceproduct!: number;        // Precio del producto
  
    constructor(
      idproduct: number,
      nameproduct: string,
      descriptionproduct: string,
      stockproduct: number,
      idcategory: number,
      idbrand: number,
      idgender: number,
      image: any,
      priceproduct: number
    ) {
      this.idproduct = idproduct;
      this.nameproduct = nameproduct;
      this.descriptionproduct = descriptionproduct;
      this.stockproduct = stockproduct;
      this.idcategory = idcategory;
      this.idbrand = idbrand;
      this.idgender = idgender;
      this.image = image;
      this.priceproduct = priceproduct;
    }
  }
  