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
@Injectable({providedIn: 'root'})
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
    firstname TEXT,
    secondname TEXT,
    firstlastname TEXT,
    secondlastname TEXT,
    imageuser BLOB NOT NULL,
    genderuser TEXT CHECK(genderuser IN ('Femenino', 'Masculino', '')),
    email TEXT NOT NULL UNIQUE,
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
    size INTEGER NOT NULL,
    quantity INTEGER NOT NULL,
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
      "INSERT or IGNORE INTO user(rut, firstname, secondname, firstlastname, secondlastname, imageuser, genderuser, email, password, phone, idrol) VALUES('21727238-1', 'Maria', 'Pele', 'Pepe', 'Soto', '', 'Femenino', 'maria23@gmail.com', '123Maria.', 932648837, 1);"
    ];
    for (let insert of inserts) {
      await this.database.executeSql(insert, []).catch(e => {this.presentAlert('Error en la inserción', 'Error al insertar datos estáticos: ' + JSON.stringify(e));});
    }
  };
  listProducts = new BehaviorSubject([]);
  listProductSizes = new BehaviorSubject([]);
  listCards = new BehaviorSubject([]);
  listCardsUser = new BehaviorSubject([]);
  listOrders = new BehaviorSubject([]);
  listOrderHistory = new BehaviorSubject([]);
  listComplaint = new BehaviorSubject([]);
  listFavoriteItems = new BehaviorSubject([]);
  listFavorite = new BehaviorSubject([]);
  listShoppingCart = new BehaviorSubject([]);
  listCartItem = new BehaviorSubject([]);
  listUsers = new BehaviorSubject([]);
  private isDBReady: BehaviorSubject<boolean> = new BehaviorSubject(false);
  constructor(private sqlite: SQLite, private platform: Platform, private alertController: AlertController) {this.createConection();}
  dbReady(){return this.isDBReady.asObservable();};
  async presentAlert(title: string, message: string) {
    const alert = await this.alertController.create({
      header: title,
      message: message,
      buttons: ['OK'],
    });
    await alert.present();}
  createConection(){
    this.platform.ready().then(()=>{
      this.sqlite.create({
        name: 'shoevaultexample1.db',
        location: 'default'
      }).then((db: SQLiteObject)=>{
        this.database = db;
        this.createTables()
        this.insertStaticData();
        this.isDBReady.next(true);
      }).catch(e=>{this.presentAlert('Crear Conexion', 'Error en crear BD: ' + JSON.stringify(e));})})
  };
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
    } catch (e) {this.presentAlert('Crear tabla', 'Error en crear tabla: ' + JSON.stringify(e));}
  };
  async searchProducts(){
    try {
      const res = await this.database.executeSql('SELECT * FROM product', []);
      let items: Productos[] = [];
      if (res.rows.length > 0) {
        for (var i = 0; i < res.rows.length; i++) {
          items.push({idproduct: res.rows.item(i).idproduct,nameproduct: res.rows.item(i).nameproduct,descriptionproduct: res.rows.item(i).descriptionproduct,stockproduct: res.rows.item(i).stockproduct,idcategory: res.rows.item(i).idcategory,idbrand: res.rows.item(i).idbrand,idgender: res.rows.item(i).idgender,image: res.rows.item(i).image,priceproduct: res.rows.item(i).priceproduct});
        }
      }
      this.listProducts.next(items as any);
    } catch (e) {this.presentAlert('Select', 'Error:' + JSON.stringify(e));}
  };
  async searchProductSizes() {
    try {
      const res = await this.database.executeSql('SELECT * FROM product_size', []);
      let items: ProductSizes[] = [];
      if (res.rows.length > 0) {
        for (var i = 0; i < res.rows.length; i++) {
          items.push({idproduct_size: res.rows.item(i).idproduct_size,idproduct: res.rows.item(i).idproduct,idsize: res.rows.item(i).idsize});}
      }
      this.listProductSizes.next(items as any);
    } catch (e) {this.presentAlert('Error', 'Error al obtener las tallas: ' + JSON.stringify(e));}
  }
  async fetchProductSizesByProductId(idproduct: number): Promise<ProductSizes[]> {
    try {
      const query = `SELECT * FROM product_size WHERE idproduct = ?`;
      const res = await this.database.executeSql(query, [idproduct]);
      let productSizes: ProductSizes[] = [];

      if (res.rows.length > 0) {
        for (let i = 0; i < res.rows.length; i++) {
          productSizes.push({idproduct_size: res.rows.item(i).idproduct_size,idproduct: res.rows.item(i).idproduct,idsize: res.rows.item(i).idsize});
        }
      }
      return productSizes;
    } catch (error) {console.error('Error al obtener las tallas asociadas al producto:', error); throw error;
    }
  }
  async searchUsers() {
    try {
      const res = await this.database.executeSql('SELECT * FROM user', []);
      let items: Users[] = [];
      if (res.rows.length > 0) {
        for (var i = 0; i < res.rows.length; i++) {
          items.push({rut: res.rows.item(i).rut,firstname: res.rows.item(i).firstname,secondname: res.rows.item(i).secondname,firstlastname: res.rows.item(i).firstlastname,secondlastname: res.rows.item(i).secondlastname,imageuser: res.rows.item(i).imageuser,genderuser: res.rows.item(i).genderuser,email: res.rows.item(i).email,password: res.rows.item(i).password,phone: res.rows.item(i).phone,idrol: res.rows.item(i).idrol,});}
      }
      this.listUsers.next(items as any);
    } catch (e) {this.presentAlert('Error', 'Error al obtener las tallas: ' + JSON.stringify(e));}
  }
  async searchShoppingCarts() {
    try {
      let items: ShoppingCart[] = [];
      const res = await this.database.executeSql('SELECT * FROM shopping_cart', []);
      if (res.rows.length > 0) {
        for (let i = 0; i < res.rows.length; i++) {
          items.push({rut: res.rows.item(i).rut,idcart: res.rows.item(i).idcart,});
        }
      }
      this.listShoppingCart.next(items as any);
    } catch (e) {
      this.presentAlert('Error', 'Error al actualizar carrito de compras: ' + JSON.stringify(e));
    }
  }
    async searchCartItems(idcart: number) {
      try {
        const res = await this.database.executeSql('SELECT * FROM cart_item WHERE idcart = ?', [idcart]);
        let items: CartItem[] = [];
        if (res.rows.length > 0) {
          for (let i = 0; i < res.rows.length; i++) {
            const row = res.rows.item(i);
            items.push({
              idcart_item: row.idcart_item,
              idcart: row.idcart,
              idproduct: row.idproduct,
              size: row.size,
              quantity: row.quantity
            });
          }
        }
        this.listCartItem.next(items as any);  // Actualizamos el observable
      } catch (error) {
        console.error('Error al actualizar items de carrito de compras:', error);
      }
    }
    fetchCartItems() {
      return this.listCartItem.asObservable();
  }
  async searchFavorites() {
    try {
      const res = await this.database.executeSql('SELECT * FROM favorites_list', []);
      let items: any[] = [];
      if (res.rows.length > 0) {
        for (var i = 0; i < res.rows.length; i++) {
          items.push({idlist: res.rows.item(i).idlist,rut: res.rows.item(i).rut,list_name: res.rows.item(i).list_name,created_at: res.rows.item(i).created_at});
        }
      }
      this.listFavorite.next(items as any);
    } catch (e) {this.presentAlert('Select', 'Error: ' + JSON.stringify(e));}
  }
  async searchFavoriteItem(idlist: number) {
    try {
      const res = await this.database.executeSql('SELECT * FROM favorite_item WHERE idlist = ?', [idlist]);
      let items: any[] = [];
      if (res.rows.length > 0) {
        for (var i = 0; i < res.rows.length; i++) {
          items.push({idfavorite_item: res.rows.item(i).idfavorite_item,idlist: res.rows.item(i).idlist,idproduct: res.rows.item(i).idproduct,added_at: res.rows.item(i).added_at});
        }
      }
      this.listFavoriteItems.next(items as any); // Actualizamos el observable con los resultados
    } catch (e) {this.presentAlert('Select', 'Error: ' + JSON.stringify(e));}
  }
  async insertProduct(name: string, description: string, stock: number, idcategory: number, idbrand: number, idgender: number, image: any, priceproduct: number): Promise<number> {
    const query = `INSERT INTO product (nameproduct, descriptionproduct, stockproduct, idcategory, idbrand, idgender, image, priceproduct) VALUES (?, ?, ?, ?, ?, ?, ?, ?)`;
    return this.database.executeSql(query, [name, description, stock, idcategory, idbrand, idgender, image, priceproduct])
      .then(res => {this.searchProducts(); return res.insertId;});
  }
  async deleteProduct(id: number) {
    try {
      await this.deleteProductSizes(id);
      const res = await this.database.executeSql('DELETE FROM product WHERE idproduct = ?', [id]);
      this.searchProducts();
    } catch (e) {this.presentAlert('Eliminar', 'Error: ' + JSON.stringify(e));}
  }
  async editProduct(id: number, nameproduct: string, descriptionproduct: string, stockproduct: number, idcategory: number, idbrand: number, idgender: number, image: any, priceproduct: number) {
    try {
      const res = await this.database.executeSql(
        'UPDATE product SET nameproduct = ?, descriptionproduct = ?, stockproduct = ?, idcategory = ?, idbrand = ?, idgender = ?, image = ?, priceproduct = ? WHERE idproduct = ?',
        [nameproduct, descriptionproduct, stockproduct, idcategory, idbrand, idgender, image, priceproduct, id]);
      this.presentAlert("Modificar", "Producto modificado correctamente");
      this.searchProducts();  // Actualizar el observable después de editar
    } catch (e) {this.presentAlert('Modificar', 'Error: ' + JSON.stringify(e));}
  }
  async getProductById(id: number): Promise<Productos | null> {
    const query = `SELECT * FROM product WHERE idproduct = ?`;
    return this.database.executeSql(query, [id])
      .then(res => {
        if (res.rows.length > 0) {
          const item = res.rows.item(0);
          return {idproduct: item.idproduct,nameproduct: item.nameproduct,descriptionproduct: item.descriptionproduct,stockproduct: item.stockproduct,idcategory: item.idcategory,idbrand: item.idbrand,idgender: item.idgender,image: item.image,priceproduct: item.priceproduct
          } as Productos;
        } else {return null;}
      })
      .catch(err => {this.presentAlert('Error', 'Error al obtener el producto: ' + JSON.stringify(err));return null;});
  };
  async insertProductSize(idProduct: number, idSize: number) {
    try {
      const res = await this.database.executeSql('INSERT INTO product_size (idproduct, idsize) VALUES (?, ?)',[idProduct, idSize]);
      this.searchProductSizes();
    } catch (e) {this.presentAlert('Error', 'Error al insertar talla: ' + JSON.stringify(e));}
  }
  async deleteProductSizes(productId: number) {
    try {
      const query = `DELETE FROM product_size WHERE idProduct = ?`;
      const res = await this.database.executeSql(query, [productId]);
      this.searchProductSizes();
    } catch(e) {this.presentAlert('Eliminar Tallas', 'Error: ' + JSON.stringify(e));}
  }

  async loginUser(email: string, password: string): Promise<Users | null> {
    await this.searchUsers();
    const query = `SELECT * FROM user WHERE email = ? AND password = ?`;
    try {
      const res = await this.database.executeSql(query, [email, password]);
      if (res.rows.length > 0) {
        const user = res.rows.item(0);
        return new Users(user.rut,user.firstname,user.secondname,user.firstlastname,user.secondlastname,user.imageuser,user.genderuser,user.email,user.password,user.phone,user.idrol);
      } else {return null;}
    } catch (error) {
      console.error('Error al buscar el usuario:', error);
      return null;
    }
  }
  async registerUser(rut: string,firstname: string,secondname: string,firstlastname: string,secondlastname: string,imageuser: any,genderuser: string,email: string,password: string,phone: number,idrol: number): Promise<void> {
    const query = `INSERT INTO user (rut, firstname, secondname, firstlastname, secondlastname, imageuser, genderuser, email, password, phone, idrol)VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;
    return this.database.executeSql(query, [rut, firstname, secondname, firstlastname, secondlastname, imageuser, genderuser, email, password, phone, idrol])
      .then(() => {
        console.log('Usuario registrado correctamente');
      })
      .catch(error => {
        console.error('Error registrando usuario:', JSON.stringify(error));
        throw error;
      });
  }
  async findUserByEmail(email: string): Promise<boolean> {
    const query = `SELECT * FROM user WHERE email = ?`;
    return this.database.executeSql(query, [email]).then((res) => {
      return res.rows.length > 0;
    }).catch((error) => {
      console.error('Error al verificar el email en la base de datos:', error);
      return false;
    });
  }
  async findUserByRut(rut: string): Promise<boolean> {
    const query = `SELECT * FROM user WHERE rut = ?`;
    return this.database.executeSql(query, [rut]).then((res) => {
      return res.rows.length > 0;
    }).catch((error) => {
      console.error('Error al verificar el RUT en la base de datos:', error);
      return false;
    });
  }
  async getUserByRut(rut: string): Promise<Users | null> {
    const query = `SELECT * FROM user WHERE rut = ?`;
    return this.database.executeSql(query, [rut])
      .then(res => {
        if (res.rows.length > 0) {
          const item = res.rows.item(0);
          return {rut: item.rut,firstname: item.firstname,secondname: item.secondname,firstlastname: item.firstlastname,secondlastname: item.secondlastname,imageuser: item.imageuser,genderuser: item.genderuser,email: item.email,password: item.password,phone: item.phone,idrol: item.idrol} as Users;
        } else {
          return null;
        }
      })
      .catch(err => {
        this.presentAlert('Error', 'Error al obtener el usuario: ' + JSON.stringify(err));
        return null;
      });
  }
  async editUser(rut: string,firstname: string,secondname: string,firstlastname: string,secondlastname: string,genderuser: string,email: string,password: string,phone: number,idrol: number,imageuser: any) {
    try {
      const res = await this.database.executeSql('UPDATE user SET firstname = ?, secondname = ?, firstlastname = ?, secondlastname = ?, genderuser = ?, email = ?, password = ?, phone = ?, idrol = ?, imageuser = ? WHERE rut = ?',[firstname, secondname, firstlastname, secondlastname, genderuser, email, password, phone, idrol, imageuser, rut]);
      if (res.rowsAffected > 0) {
        console.log('Usuario actualizado correctamente en la base de datos.');
        await this.searchUsers();
        return true;
      } else {
        console.error('No se encontró el usuario con el rut proporcionado.');
        return false;
      }
    } catch (e) {
      console.error('Error al modificar el usuario:', e);
      this.presentAlert('Modificar', 'Error: ' + JSON.stringify(e));
      return false;
    }
  }
  async createNewCart(rut: string): Promise<number> {
    const query = `INSERT INTO shopping_cart (rut) VALUES (?)`;
    try {
      const res = await this.database.executeSql(query, [rut]);
      return res.insertId;  // Devolvemos el id del carrito creado
    } catch (error) {
      console.error('Error al crear un nuevo carrito:', error);
      throw error;
    }
  }
  async deleteCart(idcart: number) {
    try {
      await this.deleteCartItem(idcart);
      const res = await this.database.executeSql('DELETE FROM shopping_cart WHERE idcart = ?', [idcart]);
      this.searchShoppingCarts();
    } catch (e) {
      this.presentAlert('Eliminar Carrito', 'Error: ' + JSON.stringify(e));
    }
  }
  async getCartItem(idcart: number, idproduct: number, size: number): Promise<CartItem | null> {
    const query = `SELECT * FROM cart_item WHERE idcart = ? AND idproduct = ? AND size = ?`;
    try {
      const res = await this.database.executeSql(query, [idcart, idproduct, size]);
      if (res.rows.length > 0) {
        const item = res.rows.item(0);
        return {
          idcart_item: item.idcart_item,
          idcart: item.idcart,
          idproduct: item.idproduct,
          size: item.size,
          quantity: item.quantity
        } as CartItem;
      } else {
        return null;
      }
    } catch (error) {
      console.error('Error al obtener el ítem del carrito:', error);
      throw error;
    }
  }
  async getCartItemsByCartId(idcart: number): Promise<CartItem[]> {
    const query = `SELECT * FROM cart_item WHERE idcart = ?`;
    try {
      const res = await this.database.executeSql(query, [idcart]);
      let items: CartItem[] = [];
      if (res.rows.length > 0) {
        for (let i = 0; i < res.rows.length; i++) {
          const row = res.rows.item(i);
          items.push(new CartItem(row.idcart, row.idproduct, row.quantity, row.size, row.idcart_item)); // Pasar idcart_item
        }
      }
      return items;
    } catch (error) {
      console.error('Error al obtener los ítems del carrito:', error);
      throw error;
    }
  }
  async getShoppingCartByRut(rut: string): Promise<ShoppingCart | null> {
    const query = `SELECT * FROM shopping_cart WHERE rut = ?`;
    try {
      const res = await this.database.executeSql(query, [rut]);
      if (res.rows.length > 0) {
        const cart = res.rows.item(0);
        return {
          idcart: cart.idcart,
          rut: cart.rut,
        } as ShoppingCart;
      } else {
        return null;
      }
    } catch (error) {
      console.error('Error al obtener el carrito de compras por rut:', error);
      return null;
    }
  }
  async getShoppingCartById(idcart: number): Promise<ShoppingCart | null> {
    const query = `SELECT * FROM shopping_cart WHERE idcart = ?`;
    return this.database.executeSql(query, [idcart])
      .then(res => {
        if (res.rows.length > 0) {
          const item = res.rows.item(0);
          return new ShoppingCart(item.idcart, item.rut,);
        } else {return null;}
      })
      .catch(err => {console.error('Error al obtener el carrito:', err);return null;});
  }
  async insertCartItem(idcart: number, idproduct: number, selectedSize: number, quantity: number): Promise<void> {
    const query = `INSERT INTO cart_item (idcart, idproduct, size, quantity) VALUES (?, ?, ?, ?)`;
    return this.database.executeSql(query, [idcart, idproduct, selectedSize, quantity])
      .then(() => {
        console.log('Se ejecuto la query, vamos bien');
        this.searchCartItems(idcart);
      })
      .catch(error => {
        console.error('Error al insertar item en el carrito:', error);
        throw error;
      });
  }
  async deleteCartItem(idcart_item: number): Promise<void> {
    const query = `DELETE FROM cart_item WHERE idcart_item = ?`;
    try {
      await this.database.executeSql(query, [idcart_item]);
      console.log('Item eliminado del carrito:', idcart_item);
    } catch (error) {
      console.error('Error al eliminar el item del carrito:', JSON.stringify(error));
      throw error;
    }
  }
  async updateCartItemQuantity(idcart: number, idcart_item: number, quantity: number): Promise<void> {
    const query = `UPDATE cart_item SET quantity = ? WHERE idcart_item = ?`;
    try {
      await this.database.executeSql(query, [quantity, idcart_item]);
      console.log(`Cantidad actualizada a ${quantity} para el item ${idcart_item}`);
      this.searchCartItems(idcart);
    } catch (error) {
      console.error('Error al actualizar la cantidad en cart_item:', error);
    }
  }
  async updateCartItemQuantityWithSize(idcart: number, idproduct: number, selectedSize: number, totalQuantity: number): Promise<void> {
    const query = `UPDATE cart_item SET quantity = ? WHERE idcart = ? AND idproduct = ? AND size = ?`;
    try {
      await this.database.executeSql(query, [totalQuantity, idcart, idproduct, selectedSize]);
      console.log(`Cantidad actualizada a ${totalQuantity} para el producto ${idproduct} con talla ${selectedSize} en el carrito ${idcart}`);
      this.searchCartItems(idcart);
    } catch (error) {
      console.error('Error al actualizar la cantidad en cart_item con talla:', error);
      throw error;
    }
  }

  async getFavoriteListsByRut(rut: string): Promise<Favoriteslist[]> {
    const query = `SELECT * FROM favorites_list WHERE rut = ?`;
    try {
      const res = await this.database.executeSql(query, [rut]);
      let lists: Favoriteslist[] = [];
      if (res.rows.length > 0) {
        for (let i = 0; i < res.rows.length; i++) {
          lists.push({idlist: res.rows.item(i).idlist,rut: res.rows.item(i).rut,list_name: res.rows.item(i).list_name} as Favoriteslist);
        }
      }
      return lists;
    } catch (error) {console.error('Error al obtener las listas de favoritos:', error); return [];}
  }
  async getFavoriteItemsByListId(idlist: number): Promise<any[] | null> {
    const query = `SELECT * FROM favorite_item WHERE idlist = ?`;
    try {
      const res = await this.database.executeSql(query, [idlist]);
      if (res.rows.length > 0) {
        let items: any[] = [];
        for (let i = 0; i < res.rows.length; i++) {
          items.push(res.rows.item(i));
        }
        return items;
      } else {return null;}
    } catch (error) {console.error('Error al obtener los ítems de la lista de favoritos:', error);return null;
    }
  }
  async createFavoriteList(rut: string, listName: string): Promise<number | null> {
    const query = `INSERT INTO favorites_list (rut, list_name) VALUES (?, ?)`;
    try {
      const res = await this.database.executeSql(query, [rut, listName]);
      return res.insertId;
    } catch (error) {console.error('Error al crear la lista "All":', error);return null;}
  }
  async getFavoriteListByRutAndName(rut: string, listName: string): Promise<any | null> {
    const query = `SELECT * FROM favorites_list WHERE rut = ? AND list_name = ?`;
    try {
      const res = await this.database.executeSql(query, [rut, listName]);
      if (res.rows.length > 0) {
        return res.rows.item(0);
      } else {
        return null;
      }
    } catch (error) {console.error('Error al obtener la lista de favoritos "All":', error);return null;}
  }
  fetchCartItemByCartId(idcart: number) {
    const query = `SELECT * FROM cart_item WHERE idcart = ?`;
    return this.database.executeSql(query, [idcart])
      .then((res: any) => {
        let cartItems: CartItem[] = [];
        for (let i = 0; i < res.rows.length; i++) {
          cartItems.push(res.rows.item(i));
        }
        return cartItems;
      });
  }
  async addFavoriteItem(idlist: number, idproduct: number): Promise<void> {
    const query = `INSERT INTO favorite_item (idlist, idproduct) VALUES (?, ?)`;
    try {
      await this.database.executeSql(query, [idlist, idproduct]);
      console.log('Producto agregado a la lista de favoritos en la base de datos');
    } catch (error) {
      console.error('Error al agregar el producto a la lista de favoritos:', error);
      throw error;
    }
  }
  async deleteFavoriteItem(idlist: number, idproduct: number): Promise<void> {
    const query = `DELETE FROM favorite_item WHERE idlist = ? AND idproduct = ?`;
    try {
      await this.database.executeSql(query, [idlist, idproduct]);
      console.log('Producto eliminado de la lista de favoritos en la base de datos');
    } catch (error) {
      console.error('Error al eliminar el producto de la lista de favoritos:', error);
      throw error;
    }
  }
  async isProductInFavorites(idlist: number, idproduct: number): Promise<boolean> {
    const query = `SELECT * FROM favorite_item WHERE idlist = ? AND idproduct = ?`;
    const res = await this.database.executeSql(query, [idlist, idproduct]);
    return res.rows.length > 0; // Devuelve true si el producto está en favoritos
  }
  async insertOrder(totalorder: number, idproduct: number, idcard: number, rut: string): Promise<number> {
    const query = `
      INSERT INTO "order" (totalorder, idproduct, idcard, rut)
      VALUES (?, ?, ?, ?);
    `;
    try {
      const result = await this.database.executeSql(query, [totalorder, idproduct, idcard, rut]);
      return result.insertId;
    } catch (error) {
      console.error('Error al insertar la orden:', error);
      throw error;
    }
  }
  async insertOrderHistory(idorder: number, rut: string, idstate: number): Promise<void> {
    const query = `
      INSERT INTO order_history (idorder, rut, idstate)
      VALUES (?, ?, ?);
    `;
    try {
      await this.database.executeSql(query, [idorder, rut, idstate]);
    } catch (error) {
      console.error('Error al insertar en el historial de órdenes:', error);
      throw error;
    }
  }
  async getOrdersByRut(rut: string): Promise<Order[]> {
    const query = `SELECT * FROM "order" WHERE rut = ?`;
    try {
      const res = await this.database.executeSql(query, [rut]);
      let orders: Order[] = [];
      if (res.rows.length > 0) {
        for (let i = 0; i < res.rows.length; i++) {
          orders.push({ idorder: res.rows.item(i).idorder, created_at: res.rows.item(i).created_at, totalorder: res.rows.item(i).totalorder, idproduct: res.rows.item(i).idproduct, idcard: res.rows.item(i).idcard, idcomplaint: res.rows.item(i).idcomplaint, rut: res.rows.item(i).rut,
          } as Order);
        }
      }
      return orders;
    } catch (error) {
      console.error('Error al obtener las órdenes por rut:', error);
      return [];
    }
  }
  async getOrderHistoryByRut(rut: string): Promise<OrderHistory[]> {
    const query = `SELECT * FROM order_history WHERE rut = ?`;
    try {
      const res = await this.database.executeSql(query, [rut]);
      let orderHistory: OrderHistory[] = [];
      if (res.rows.length > 0) {
        for (let i = 0; i < res.rows.length; i++) {
          orderHistory.push({
            idhistory: res.rows.item(i).idhistory,
            idorder: res.rows.item(i).idorder,
            rut: res.rows.item(i).rut,
            idstate: res.rows.item(i).idstate,
            change_date: res.rows.item(i).change_date,
          } as OrderHistory);
        }
      }
      return orderHistory;
    } catch (error) {
      console.error('Error al obtener el historial de órdenes:', error);
      return [];
    }
  }

  //SELECTS DINAMICOS CON CLASS
  fetchProducts(): Observable<Productos[]>{return this.listProducts.asObservable();}
  fetchCard(): Observable<Card[]>{return this.listCards.asObservable();}
  fetchCardUser(): Observable<CardUsers[]>{return this.listCardsUser.asObservable();}
  fetchOrder(): Observable<Order[]>{return this.listOrders.asObservable();}
  fetchOrderHistory(): Observable<OrderHistory[]>{return this.listOrderHistory.asObservable();}
  fetchComplaint(): Observable<Complaint[]>{return this.listComplaint.asObservable();}
  fetchFavoriteItems(): Observable<FavoriteItems[]>{return this.listFavoriteItems.asObservable();}
  fetchFavorite(): Observable<Favoriteslist[]>{return this.listFavorite.asObservable();}
  fetchProductSizes(): Observable<ProductSizes[]>{return this.listProductSizes.asObservable();}
  fetchShoppingCart(): Observable<ShoppingCart[]>{return this.listShoppingCart.asObservable();}
  fetchCartItem(): Observable<CartItem[]>{return this.listCartItem.asObservable();}
  fetchUsers(): Observable<Users[]>{return this.listUsers.asObservable();}
  //SELECT ESTATICOS GENDER, ROL, SIZES, BRANDS, CATEGORY, STATE ORDER
  async fetchBrands() {
    try {
      const res = await this.database.executeSql('SELECT * FROM brand', []);
      let brands: any[] = [];
      if (res.rows.length > 0) {
        for (let i = 0; i < res.rows.length; i++) {brands.push(res.rows.item(i));}
      }
      return brands;
    } catch (e) {
      this.presentAlert('Error', 'Error en SELECT: ' + JSON.stringify(e));return [];}
  }
  async fetchCategories() {
    try {
      const res = await this.database.executeSql('SELECT * FROM category', []);
      let categories: any[] = [];
      if (res.rows.length > 0) {
        for (let i = 0; i < res.rows.length; i++) {categories.push(res.rows.item(i));}
      }
      return categories;
    }catch{return [];}
  }
  async fetchGenders() {
    try {
      const res = await this.database.executeSql('SELECT * FROM gender', []);
      let genders: any[] = [];
      if (res.rows.length > 0) {
        for (let i = 0; i < res.rows.length; i++) {genders.push(res.rows.item(i));}
      }
      return genders;
    }catch{return [];}
  }
  async fetchSizes() {
    try {
      const res = await this.database.executeSql('SELECT * FROM size', []);
      let sizes: any[] = [];
      if (res.rows.length > 0) {
        for (let i = 0; i < res.rows.length; i++) {sizes.push(res.rows.item(i));}
      }
      return sizes;
    } catch{return [];}
  }
  async fetchStateOrders() {
    try {
      const res = await this.database.executeSql('SELECT * FROM state_order', []);
      let stateOrders: any[] = [];
      if (res.rows.length > 0) {
        for (let i = 0; i < res.rows.length; i++) {stateOrders.push(res.rows.item(i));}
      }
      return stateOrders;
    } catch{
      return [];
    }
  }
  async fetchRoles() {
    try {
      const res = await this.database.executeSql('SELECT * FROM rol', []);
      let roles: any[] = [];
      if (res.rows.length > 0) {
        for (let i = 0; i < res.rows.length; i++) {roles.push(res.rows.item(i));}
      }
      return roles;
    } catch{return [];}
  }

}
