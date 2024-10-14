import { Injectable } from '@angular/core';
import { SQLite, SQLiteObject } from '@awesome-cordova-plugins/sqlite/ngx';
import { AlertController, Platform } from '@ionic/angular';
import { BehaviorSubject, Observable } from 'rxjs';
import { Productos } from './productos';
import { Card } from './card';
import { CardUsers } from './card-users';
import { CartItem } from './cart-item';
import { Complaint } from './complaint';
import { FavoriteItems } from './favorite-items';
import { Favoriteslist } from './favoriteslist';
import { OrderHistory } from './order-history';
import { Order } from './order';
import { ProductSizes } from './product-sizes';
import { ShoppingCart } from './shopping-cart';
import { Users } from './users';
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
    FOREIGN KEY (idsize) REFERENCES size(idsize)
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
  //inserts iniciales

  async insertStaticData():Promise<void>{
    const inserts = [
      "INSERT or IGNORE INTO brand(idbrand, namebrand) VALUES(1, 'Adidas');",
      "INSERT or IGNORE INTO brand(idbrand, namebrand) VALUES(2, 'Puma');",
      "INSERT or IGNORE INTO category(idcategory, namecategory) VALUES(1, 'Running');",
      "INSERT or IGNORE INTO category(idcategory, namecategory) VALUES(2, 'LifeStyle');",
      "INSERT or IGNORE INTO size(idsize, size) VALUES(1, 10);",
      "INSERT or IGNORE INTO size(idsize, size) VALUES(2, 15);",
      "INSERT or IGNORE INTO size(idsize, size) VALUES(3, 20);",
      "INSERT or IGNORE INTO size(idsize, size) VALUES(4, 25);",
      "INSERT or IGNORE INTO size(idsize, size) VALUES(5, 30);",
      "INSERT or IGNORE INTO size(idsize, size) VALUES(6, 35);",
      "INSERT or IGNORE INTO gender(idgender, namegender) VALUES(1, 'Femenino');",
      "INSERT or IGNORE INTO gender(idgender, namegender) VALUES(2, 'Masculino');",
      "INSERT or IGNORE INTO state_order(idstate, state) VALUES(1, 'Compra Realizada');",
      "INSERT or IGNORE INTO state_order(idstate, state) VALUES(2, 'Pendiente a Retiro');",
      "INSERT or IGNORE INTO state_order(idstate, state) VALUES(3, 'Entregado');",
      "INSERT or IGNORE INTO state_order(idstate, state) VALUES(4, 'Pendiente a reclamo');",
      "INSERT or IGNORE INTO state_order(idstate, state) VALUES(5, 'Solicitud de reclamo rechazada');",
      "INSERT or IGNORE INTO state_order(idstate, state) VALUES(6, 'Solicitud de reclamo aceptada');",
      "INSERT or IGNORE INTO rol(idrol, rol) VALUES(1, 'Admin');",
      "INSERT or IGNORE INTO rol(idrol, rol) VALUES(2, 'User');",
      "INSERT or IGNORE INTO complaint(idcomplaint, namecomplaint, type_complaint) VALUES(1, 'No hay reclamo', 'Ninguno');",
      "INSERT or IGNORE INTO complaint(idcomplaint, namecomplaint, type_complaint) VALUES(2, 'Producto Incorrecto', 'Cambio de producto');",
      "INSERT or IGNORE INTO complaint(idcomplaint, namecomplaint, type_complaint) VALUES(3, 'Error en la autenticidad', 'Devolución');",
    ];
    for (let insert of inserts) {
      await this.database.executeSql(insert, []).catch(e => {
        this.presentAlert('Error en la inserción', 'Error al insertar datos estáticos: ' + JSON.stringify(e));
      });
    }
  }

  listProducts = new BehaviorSubject([]);
  listCards = new BehaviorSubject([]);
  listCardsUser = new BehaviorSubject([]);
  listOrders = new BehaviorSubject([]);
  listOrderHistory = new BehaviorSubject([]);
  listComplaint = new BehaviorSubject([]);
  listFavoriteItems = new BehaviorSubject([]);
  listFavorite = new BehaviorSubject([]);
  listProductSizes = new BehaviorSubject([]);
  listShoppingCart = new BehaviorSubject([]);
  listCartItem = new BehaviorSubject([]);
  listUsers = new BehaviorSubject([]);

  // Observable para estado de la BBDD
  private isDBReady: BehaviorSubject<boolean> = new BehaviorSubject(false);
  constructor(private sqlite: SQLite, private platform: Platform, private alertController: AlertController) {
    this.createConection();
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
  createConection(){
    this.platform.ready().then(()=>{
      this.sqlite.create({
        name: 'shoevault.db',
        location: 'default'
      }).then((db: SQLiteObject)=>{
        this.database = db;
        this.createTables()
        this.insertStaticData();
        this.isDBReady.next(true);
      }).catch(e=>{
        this.presentAlert('Crear Conexion', 'Error en crear BD: ' + JSON.stringify(e));
      })

    })
  }



  async createTables() {
    try {
      await this.database.executeSql(this.tableBrand, []);
      await this.database.executeSql(this.tableCategory, []);
      await this.database.executeSql(this.tableSize, []);
      await this.database.executeSql(this.tableGender, []);
      await this.database.executeSql(this.tableStateOrder, []);
      await this.database.executeSql(this.tableRol, []);
      await this.database.executeSql(this.tableCard, []);
      await this.database.executeSql(this.tableComplaint, []);
      await this.database.executeSql(this.tableUser, []);
      await this.database.executeSql(this.tableProduct, []);
      await this.database.executeSql(this.tableFavoritesList, []);
      await this.database.executeSql(this.tableShoppingCart, []);
      await this.database.executeSql(this.tableOrder, []);
      await this.database.executeSql(this.tableUserCards, []);
      await this.database.executeSql(this.tableProductSize, []);
      await this.database.executeSql(this.tableFavoriteItem, []);
      await this.database.executeSql(this.tableCartItem, []);
      await this.database.executeSql(this.tableOrderHistory, []);
    } catch (e) {
      this.presentAlert('Crear tabla', 'Error en crear tabla: ' + JSON.stringify(e));
    }
  }
  async searchProducts(){
    try {
      const res = await this.database.executeSql('SELECT * FROM product', []);
      let items: Productos[] = [];
      if (res.rows.length > 0) {
        for (var i = 0; i < res.rows.length; i++) {
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
          });
        }
      }
      this.listProducts.next(items as any);
    } catch (e) {
      this.presentAlert('Select', 'Error:' + JSON.stringify(e));
    }
  }
  // async searchCards() {
  //   try {
  //     const res = await this.database.executeSql('SELECT * FROM card', []);
  //     let items: Card[] = [];
  //     if (res.rows.length > 0) {
  //       for (let i = 0; i < res.rows.length; i++) {
  //         items.push({
  //           idcard: res.rows.item(i).idcard,
  //           cardname: res.rows.item(i).cardname,
  //           cardnumber: res.rows.item(i).cardnumber,
  //           // Otros campos que tengas en la tabla card
  //         });
  //       }
  //     }
  //     this.listCards.next(items); // Actualiza el BehaviorSubject con los datos encontrados
  //   } catch (e) {
  //     this.presentAlert('Select', 'Error al buscar las tarjetas: ' + JSON.stringify(e));
  //   }
  // }

  async insertProduct(name: string, description: string, stock: number, idcategory: number, idbrand: number, idgender: number, image: any, priceproduct: number): Promise<number> {
    const query = `INSERT INTO product (nameproduct, descriptionproduct, stockproduct, idcategory, idbrand, idgender, image, priceproduct) VALUES (?, ?, ?, ?, ?, ?, ?, ?)`;

    return this.database.executeSql(query, [name, description, stock, idcategory, idbrand, idgender, image, priceproduct])
      .then(res => {
        this.presentAlert("Insertar", "Producto agregado exitosamente");
        // Devolver el ID del producto insertado
        return res.insertId;
      });
  }

  async deleteProduct(id: number) {
    try {
      const res = await this.database.executeSql('DELETE FROM product WHERE idproduct = ?', [id]);
      this.presentAlert("Eliminar", "Producto eliminado correctamente");
    } catch (e) {
      this.presentAlert('Eliminar', 'Error: ' + JSON.stringify(e));
    }
  }
  async editProduct(id: number, nameproduct: string, descriptionproduct: string, stockproduct: number, idcategory: number, idbrand: number, idgender: number, image: any, priceproduct: number) {
    try {
      const res = await this.database.executeSql(
        'UPDATE product SET nameproduct = ?, descriptionproduct = ?, stockproduct = ?, idcategory = ?, idbrand = ?, idgender = ?, image = ?, priceproduct = ? WHERE idproduct = ?',
        [nameproduct, descriptionproduct, stockproduct, idcategory, idbrand, idgender, image, priceproduct, id]
      );
      this.presentAlert("Modificar", "Producto modificado correctamente");
    } catch (e) {
      this.presentAlert('Modificar', 'Error: ' + JSON.stringify(e));
    }

  }
  async insertProductSize(idProduct: number, idSize: number){
    try{
      const res = await this.database.executeSql(
        'INSERT INTO product_size (idproduct, idsize) VALUES(?,?)', [idProduct, idSize])
    }catch(e) {
      this.presentAlert('Insertar Talla a Producto', 'Error:' + JSON.stringify(e));
    };
  }
  //SELECTS DINAMICOS CON CLASS
  fetchProducts(): Observable<Productos[]>{
    return this.listProducts.asObservable();
  }
  fetchCard(): Observable<Card[]>{
    return this.listCards.asObservable();
  }
  fetchCardUser(): Observable<CardUsers[]>{
    return this.listCardsUser.asObservable();
  }
  fetchOrder(): Observable<Order[]>{
    return this.listOrders.asObservable();
  }
  fetchOrderHistory(): Observable<OrderHistory[]>{
    return this.listOrderHistory.asObservable();
  }
  fetchComplaint(): Observable<Complaint[]>{
    return this.listComplaint.asObservable();
  }
  fetchFavoriteItems(): Observable<FavoriteItems[]>{
    return this.listFavoriteItems.asObservable();
  }
  fetchFavorite(): Observable<Favoriteslist[]>{
    return this.listFavorite.asObservable();
  }
  fetchProductSizes(): Observable<ProductSizes[]>{
    return this.listProductSizes.asObservable();
  }
  fetchShoppingCart(): Observable<ShoppingCart[]>{
    return this.listShoppingCart.asObservable();
  }
  fetchCartItem(): Observable<CartItem[]>{
    return this.listCartItem.asObservable();
  }
  fetchUsers(): Observable<Users[]>{
    return this.listUsers.asObservable();
  }
  //SELECT ESTATICOS GENDER, ROL, SIZES, BRANDS, CATEGORY, STATE ORDER, ROL
  async fetchBrands() {
    try {
      const res = await this.database.executeSql('SELECT * FROM brand', []);
      let brands: any[] = [];
      if (res.rows.length > 0) {
        for (let i = 0; i < res.rows.length; i++) {
          brands.push(res.rows.item(i));
        }
      }
      return brands;
    } catch (e) {
      this.presentAlert('Error', 'Error en SELECT: ' + JSON.stringify(e));
      return [];
    }
  }
  async fetchCategories() {
    try {
      const res = await this.database.executeSql('SELECT * FROM category', []);
      let categories: any[] = [];
      if (res.rows.length > 0) {
        for (let i = 0; i < res.rows.length; i++) {
          categories.push(res.rows.item(i));
        }
      }
      return categories;
    } catch (e) {
      this.presentAlert('Error', 'Error en SELECT: ' + JSON.stringify(e));
      return [];
    }
  }
  async fetchGenders() {
    try {
      const res = await this.database.executeSql('SELECT * FROM gender', []);
      let genders: any[] = [];
      if (res.rows.length > 0) {
        for (let i = 0; i < res.rows.length; i++) {
          genders.push(res.rows.item(i));
        }
      }
      return genders;
    } catch (e) {
      this.presentAlert('Error', 'Error en SELECT: ' + JSON.stringify(e));
      return [];
    }
  }
  async fetchSizes() {
    try {
      const res = await this.database.executeSql('SELECT * FROM size', []);
      let sizes: any[] = [];
      if (res.rows.length > 0) {
        for (let i = 0; i < res.rows.length; i++) {
          sizes.push(res.rows.item(i));
        }
      }
      return sizes;
    } catch (e) {
      this.presentAlert('Error', 'Error en SELECT: ' + JSON.stringify(e));
      return [];
    }
  }
  async fetchStateOrders() {
    try {
      const res = await this.database.executeSql('SELECT * FROM state_order', []);
      let stateOrders: any[] = [];
      if (res.rows.length > 0) {
        for (let i = 0; i < res.rows.length; i++) {
          stateOrders.push(res.rows.item(i));
        }
      }
      return stateOrders;
    } catch (e) {
      this.presentAlert('Error', 'Error en SELECT: ' + JSON.stringify(e));
      return [];
    }
  }
  async fetchRoles() {
    try {
      const res = await this.database.executeSql('SELECT * FROM rol', []);
      let roles: any[] = [];
      if (res.rows.length > 0) {
        for (let i = 0; i < res.rows.length; i++) {
          roles.push(res.rows.item(i));
        }
      }
      return roles;
    } catch (e) {
      this.presentAlert('Error', 'Error en SELECT: ' + JSON.stringify(e));
      return [];
    }
  }
}
