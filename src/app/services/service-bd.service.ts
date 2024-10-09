import { Injectable } from '@angular/core';
import { SQLite, SQLiteObject } from '@awesome-cordova-plugins/sqlite/ngx';
import { AlertController, Platform } from '@ionic/angular';
import { BehaviorSubject, Observable } from 'rxjs';
import { Productos } from './productos';

@Injectable({
  providedIn: 'root'
})
export class ServiceBDService {
  public database!: SQLiteObject;

  // Definiciones de tablas
  tableBrand: string = `
  CREATE TABLE IF NOT EXISTS brand (
    idbrand INTEGER PRIMARY KEY AUTOINCREMENT,
    namebrand TEXT NOT NULL
  );`;

  tableCategory: string = `
  CREATE TABLE IF NOT EXISTS category (
    idcategory INTEGER PRIMARY KEY AUTOINCREMENT,
    namecategory TEXT NOT NULL
  );`;

  tableSize: string = `
  CREATE TABLE IF NOT EXISTS size (
    idsize INTEGER PRIMARY KEY AUTOINCREMENT,
    size INTEGER NOT NULL
  );`;

  tableGender: string = `
  CREATE TABLE IF NOT EXISTS gender (
    idgender INTEGER PRIMARY KEY AUTOINCREMENT,
    namegender TEXT NOT NULL
  );`;

  tableStateOrder: string = `
  CREATE TABLE IF NOT EXISTS state_order (
    idstate INTEGER PRIMARY KEY AUTOINCREMENT,
    state TEXT NOT NULL
  );`;

  tableRol: string = `
  CREATE TABLE IF NOT EXISTS rol (
    idrol INTEGER PRIMARY KEY AUTOINCREMENT,
    rol TEXT NOT NULL
  );`;

  tableCard: string = `
  CREATE TABLE IF NOT EXISTS card (
    idcard INTEGER PRIMARY KEY AUTOINCREMENT,
    nrocard TEXT CHECK(LENGTH(nrocard) = 16 AND nrocard GLOB '[0-9]*') NOT NULL,
    datecard TEXT NOT NULL,
    namecard TEXT NOT NULL,
    cvvcard TEXT CHECK(LENGTH(cvvcard) = 3 AND cvvcard GLOB '[0-9]*') NOT NULL
  );`;

  tableComplaint: string = `
  CREATE TABLE IF NOT EXISTS complaint (
    idcomplaint INTEGER PRIMARY KEY AUTOINCREMENT,
    namecomplaint TEXT NOT NULL,
    descriptioncomplaint TEXT,
    type_complaint TEXT NOT NULL
  );`;

  // Tablas dependientes
  tableProduct: string = `
  CREATE TABLE IF NOT EXISTS product (
    idproduct INTEGER PRIMARY KEY AUTOINCREMENT,
    nameproduct TEXT NOT NULL,
    descriptionproduct TEXT NOT NULL,
    stockproduct INTEGER CHECK(stockproduct > 0) NOT NULL,
    idcategory INTEGER NOT NULL,
    idbrand INTEGER NOT NULL,
    idgender INTEGER NOT NULL,
    image BLOB NOT NULL,
    priceproduct INTEGER CHECK(priceproduct > 0) NOT NULL,
    FOREIGN KEY (idcategory) REFERENCES category(idcategory),
    FOREIGN KEY (idbrand) REFERENCES brand(idbrand),
    FOREIGN KEY (idgender) REFERENCES gender(idgender)
  );`;

  tableUser: string = `
  CREATE TABLE IF NOT EXISTS user (
    rut TEXT PRIMARY KEY,
    firstname TEXT NOT NULL,
    secondname TEXT NOT NULL,
    firstlastname TEXT NOT NULL,
    secondlastname TEXT NOT NULL,
    imageuser BLOB NOT NULL,
    genderuser TEXT NOT NULL CHECK(genderuser IN ('Femenino', 'Masculino')),
    email TEXT NOT NULL UNIQUE CHECK(email LIKE '%@gmail.com'),
    password TEXT NOT NULL,
    phone INTEGER,
    idrol INTEGER NOT NULL,
    FOREIGN KEY (idrol) REFERENCES rol(idrol)
  );`;

  tableFavoritesList: string = `
  CREATE TABLE IF NOT EXISTS favorites_list (
    idlist INTEGER PRIMARY KEY AUTOINCREMENT,
    rut TEXT NOT NULL,
    list_name TEXT NOT NULL,
    created_at TEXT DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (rut) REFERENCES user(rut)
  );`;

  tableShoppingCart: string = `
  CREATE TABLE IF NOT EXISTS shopping_cart (
    idcart INTEGER PRIMARY KEY AUTOINCREMENT,
    created_at TEXT DEFAULT CURRENT_TIMESTAMP,
    rut TEXT NOT NULL,
    totalcart INTEGER NOT NULL,
    FOREIGN KEY (rut) REFERENCES user(rut)
  );`;

  tableOrder: string = `
  CREATE TABLE IF NOT EXISTS "order" (
    idorder INTEGER PRIMARY KEY AUTOINCREMENT,
    created_at TEXT DEFAULT CURRENT_TIMESTAMP,
    totalorder INTEGER NOT NULL,
    idproduct INTEGER NOT NULL,
    idcard INTEGER NOT NULL,
    idcomplaint INTEGER NOT NULL DEFAULT 1,
    rut TEXT NOT NULL,
    FOREIGN KEY (idcard) REFERENCES card(idcard),
    FOREIGN KEY (rut) REFERENCES user(rut),
    FOREIGN KEY (idcomplaint) REFERENCES complaint(idcomplaint),
    FOREIGN KEY (idproduct) REFERENCES product(idproduct)
  );`;

  // Tablas intermediarias
  tableUserCards: string = `
  CREATE TABLE IF NOT EXISTS user_card (
    iduser_card INTEGER PRIMARY KEY AUTOINCREMENT,
    idcard INTEGER NOT NULL,
    rut TEXT NOT NULL,
    FOREIGN KEY (idcard) REFERENCES card(idcard),
    FOREIGN KEY (rut) REFERENCES user(rut)
  );`;

  tableProductSize: string = `
  CREATE TABLE IF NOT EXISTS product_size (
    idproduct_size INTEGER PRIMARY KEY AUTOINCREMENT,
    idproduct INTEGER NOT NULL,
    idsize INTEGER NOT NULL,
    FOREIGN KEY (idproduct) REFERENCES product(idproduct),
    FOREIGN KEY (idsize) REFERENCES size(idsize),
    UNIQUE (idproduct, idsize)
  );`;

  tableFavoriteItem: string = `
  CREATE TABLE IF NOT EXISTS favorite_item (
    idfavorite_item INTEGER PRIMARY KEY AUTOINCREMENT,
    idlist INTEGER NOT NULL,
    idproduct INTEGER NOT NULL,
    added_at TEXT DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (idlist) REFERENCES favorites_list(idlist),
    FOREIGN KEY (idproduct) REFERENCES product(idproduct)
  );`;

  tableCartItem: string = `
  CREATE TABLE IF NOT EXISTS cart_item (
    idcart_item INTEGER PRIMARY KEY AUTOINCREMENT,
    idcart INTEGER NOT NULL,
    idproduct INTEGER NOT NULL,
    FOREIGN KEY (idcart) REFERENCES shopping_cart(idcart),
    FOREIGN KEY (idproduct) REFERENCES product(idproduct)
  );`;

  tableOrderHistory: string = `
  CREATE TABLE IF NOT EXISTS order_history (
    idhistory INTEGER PRIMARY KEY AUTOINCREMENT,
    idorder INTEGER NOT NULL,
    rut TEXT NOT NULL,
    idstate INTEGER NOT NULL,
    change_date TEXT DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (idorder) REFERENCES "order"(idorder),
    FOREIGN KEY (rut) REFERENCES user(rut),
    FOREIGN KEY (idstate) REFERENCES state_order(idstate)
  );`;
  listaProducts = new BehaviorSubject([]);
  // Observable para estado de la BBDD
  private isDBReady: BehaviorSubject<boolean> = new BehaviorSubject(false);

  constructor(private sqlite: SQLite, private platform: Platform, private alertController: AlertController) {
    this.createConection();
  }
  //funciones de retorno de observable para las variables de los selects
  fetchProducts(): Observable<Productos[]>{
    return this.listaProducts.asObservable();
  }

  dbReady(){
    return this.isDBReady.asObservable();
  }

  async presentAlert(title: string, message: string) {
    const alert = await this.alertController.create({
      header: title,
      message: message,
      buttons: ['OK'],
    });
    await alert.present();
  }

  createConection() {
    this.platform.ready().then(() => {
      this.sqlite.create({
        name: 'shoevault.db',
        location: 'default',
      }).then((db: SQLiteObject) => {
        this.database = db;
        this.createTables();
        this.isDBReady.next(true);
      }).catch(e => {
        this.presentAlert('Crear conexión', 'Error en crear la BBDD: ' + JSON.stringify(e));
      });
    });
  }



  async createTables() {
    try {
      await this.database.executeSql(this.tableBrand, []);
      await this.presentAlert('Crear tabla', 'Tabla brand creada correctamente.');

      await this.database.executeSql(this.tableCategory, []);
      await this.presentAlert('Crear tabla', 'Tabla category creada correctamente.');

      await this.database.executeSql(this.tableSize, []);
      await this.presentAlert('Crear tabla', 'Tabla size creada correctamente.');

      await this.database.executeSql(this.tableGender, []);
      await this.presentAlert('Crear tabla', 'Tabla gender creada correctamente.');

      await this.database.executeSql(this.tableStateOrder, []);
      await this.presentAlert('Crear tabla', 'Tabla state_order creada correctamente.');

      await this.database.executeSql(this.tableRol, []);
      await this.presentAlert('Crear tabla', 'Tabla rol creada correctamente.');

      await this.database.executeSql(this.tableCard, []);
      await this.presentAlert('Crear tabla', 'Tabla card creada correctamente.');

      await this.database.executeSql(this.tableComplaint, []);
      await this.presentAlert('Crear tabla', 'Tabla complaint creada correctamente.');

      await this.database.executeSql(this.tableUser, []);
      await this.presentAlert('Crear tabla', 'Tabla user creada correctamente.');

      await this.database.executeSql(this.tableProduct, []);
      await this.presentAlert('Crear tabla', 'Tabla product creada correctamente.');

      await this.database.executeSql(this.tableFavoritesList, []);
      await this.presentAlert('Crear tabla', 'Tabla favorites_list creada correctamente.');

      await this.database.executeSql(this.tableShoppingCart, []);
      await this.presentAlert('Crear tabla', 'Tabla shopping_cart creada correctamente.');

      await this.database.executeSql(this.tableOrder, []);
      await this.presentAlert('Crear tabla', 'Tabla order creada correctamente.');

      await this.database.executeSql(this.tableUserCards, []);
      await this.presentAlert('Crear tabla', 'Tabla user_card creada correctamente.');

      await this.database.executeSql(this.tableProductSize, []);
      await this.presentAlert('Crear tabla', 'Tabla product_size creada correctamente.');

      await this.database.executeSql(this.tableFavoriteItem, []);
      await this.presentAlert('Crear tabla', 'Tabla favorite_item creada correctamente.');

      await this.database.executeSql(this.tableCartItem, []);
      await this.presentAlert('Crear tabla', 'Tabla cart_item creada correctamente.');

      await this.database.executeSql(this.tableOrderHistory, []);
      await this.presentAlert('Crear tabla', 'Tabla order_history creada correctamente.');

    } catch (e) {
      this.presentAlert('Crear tabla', 'Error en crear tabla: ' + JSON.stringify(e));
    }
  }
  searchProducts(){
    return this.database.executeSql('SELECT * FROM product', []).then(res =>{
      let items: Productos[] = [];
      if(res.rows.length > 0){
        for(var i = 0; i < res.rows.length; i++){
          items.push({
            idproduct: res.rows.item(i).idproduct,
            nameproduct: res.rows.item(i).nameproduct,
            descriptionproduct: res.rows.item(i).descriptionproduct,
            stockproduct: res.rows.item(i).stockproduct,
            idcategory: res.rows.item(i).idcategory,
            idbrand: res.rows.item(i).idbrand,
            idgender: res.rows.item(i).idgender,
            image: res.rows.item(i).image,
            priceproduct: res.rows.item(i).priceproduct
          })
        }
      }

      this.listaProducts.next(items as any);

    }).catch(e=>{
      this.presentAlert('Select', 'Error:' + JSON.stringify(e));
    })
  }
  insertProduct(nameproduct: string, descriptionproduct: string, stockproduct: number, idcategory: number, idbrand: number, idgender: number, image: any, priceproduct: number){
    return this.database.executeSql('INSERT INTO product (nameproduct, descriptionproduct, stockproduct, idcategory, idbrand, idgender, image, priceproduct) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',[nameproduct, descriptionproduct, stockproduct, idcategory, idbrand, idgender, image, priceproduct]).then(res=>{
      this.presentAlert("Insertar", "Producto agregado exitosamente");
      this.searchProducts();
    }).catch(e=>{
      this.presentAlert("Insertar", "Error:" + JSON.stringify(e));
    })
  }
  deleteProduct(id: number) {
    return this.database.executeSql('DELETE FROM product WHERE idproduct = ?', [id]).then(res => {
      this.presentAlert("Eliminar", "Producto eliminado correctamente");
      this.searchProducts();
    }).catch(e => {
      this.presentAlert('Eliminar', 'Error: ' + JSON.stringify(e));
    });
  }

  editProduct(id: number, nameproduct: string, descriptionproduct: string, stockproduct: number, idcategory: number, idbrand: number, idgender: number, image: any, priceproduct: number) {
    return this.database.executeSql(
      'UPDATE product SET nameproduct = ?, descriptionproduct = ?, stockproduct = ?, idcategory = ?, idbrand = ?, idgender = ?, image = ?, priceproduct = ? WHERE idproduct = ?',
      [nameproduct, descriptionproduct, stockproduct, idcategory, idbrand, idgender, image, priceproduct, id]
    ).then(res => {
      this.presentAlert("Modificar", "Producto modificado correctamente");
      this.searchProducts();
    }).catch(e => {
      this.presentAlert('Modificar', 'Error: ' + JSON.stringify(e));
    });

  }
}
