import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { filter } from 'rxjs/operators';
import { Productos } from 'src/app/services/productos';
import { ServiceBDService } from 'src/app/services/service-bd.service';
import { ShoppingCart } from 'src/app/services/shopping-cart';
import { UserSessionService } from 'src/app/services/user-session.service';

@Component({
  selector: 'app-product-detail',
  templateUrl: './product-detail.page.html',
  styleUrls: ['./product-detail.page.scss'],
})
export class ProductDetailPage implements OnInit {
  productId: any;
  shoppingCart: ShoppingCart | null = null;
  productoDetalle: (Productos & { isFavorite: boolean }) | null = null;
  productSizes: any[] = [];
  selectedSize: number | null = null;
  selectedQuantity: number = 1;
  maxQuantity: number = 0;
  isToastOpen = false;
  toastMessage: string = '';
  sizesAvailable: any[] = [];
  idlist: number = 1;
  cartExists: boolean = false;
  constructor(
    private activatedroute: ActivatedRoute,
    private router: Router,
    private serviceBD: ServiceBDService,
    private serviceSession: UserSessionService
  ) {
    const navigation = this.router.getCurrentNavigation();
    if (navigation && navigation.extras && navigation.extras.state) {
      this.productId = navigation.extras.state['id'];
    } else {
      console.error('Error: No se pudo obtener el productId de la navegación.');
    }
  }
  ngOnInit() {
    this.verificarConexionBD();
  }
  verificarConexionBD() {
    this.serviceBD.dbReady()
      .pipe(filter(isReady => isReady))
      .subscribe(() => {
        this.serviceBD.searchCartItems();
        this.serviceBD.searchShoppingCarts();
        this.serviceSession.getUserSession().subscribe(async user => {
          if (user) {
            const cart = await this.serviceBD.getShoppingCartByRut(user.rut);
            if (cart) {
              this.cartExists = true;
              this.shoppingCart = cart;
            } else {
              this.cartExists = false;
            }
          } else {
            console.error('No se encontró una sesión de usuario activa.');
          }
        });
        this.activatedroute.params.subscribe(params => {
          this.productId = params['id'];
          if (this.productId) {
            this.cargarProducto(this.productId);
          } else {
            console.error('No se pudo cargar el detalle del producto porque no se encontró productId.');
          }
        });
      });
  }
  cargarProducto(id: number) {
    this.serviceBD.getProductById(id).then(async (product: Productos | null) => {
      if (product) {
        const isFavorite = await this.serviceBD.isProductInFavorites(this.idlist, product.idproduct);
        this.productoDetalle = {
          ...product,
          isFavorite: isFavorite
        } as Productos & { isFavorite: boolean };
        this.maxQuantity = this.productoDetalle.stockproduct;
        this.cargarTallasProducto(id);
      } else {
        console.error('Producto no encontrado');
      }
    }).catch(error => {
      console.error('Error al cargar el producto:', error);
    });
  }
  cargarTallasProducto(idproduct: number) {
    this.serviceBD.fetchProductSizesByProductId(idproduct).then((sizes: any[]) => {
      this.serviceBD.fetchSizes().then(allSizes => {
        this.productSizes = sizes.map(ps => {
          const matchedSize = allSizes.find(size => size.idsize === ps.idsize);
          return {
            ...ps,
            namesizes: matchedSize ? matchedSize.size : null
          };
        });
      });
    }).catch(error => {
      console.error('Error al cargar las tallas del producto:', error);
    });
  }
  irPagina(ruta: string) {
    this.router.navigate([ruta]);
  }
  selectSize(size: number) {
    this.selectedSize = size;
  }
  increaseQuantity() {
    if (this.selectedQuantity < this.maxQuantity) {
      this.selectedQuantity++;
    }
  }
  decreaseQuantity() {
    if (this.selectedQuantity > 1) {
      this.selectedQuantity--;
    }
  }
  getOrCreateCart(): Promise<number> {
    return new Promise((resolve, reject) => {
      this.serviceSession.getUserSession().subscribe(async user => {
        if (user) {
          try {
            if (!this.cartExists) {
              const cart = await this.serviceBD.getShoppingCartByRut(user.rut);
              if (cart) {
                this.cartExists = true;
                this.shoppingCart = cart;
                resolve(this.shoppingCart.idcart);
              } else {
                const newCartId = await this.serviceBD.createNewCart(user.rut);
                this.shoppingCart = { idcart: newCartId, rut: user.rut };
                this.cartExists = true;
                resolve(newCartId);
              }
            } else {
              resolve(this.shoppingCart!.idcart);
            }
          } catch (error) {
            console.error('Error al obtener o crear el carrito:', error);
            reject(error);
          }
        } else {
          reject(new Error('No se encontró una sesión de usuario activa.'));
        }
      });
    });
  }
  async addToCart() {
    if (!this.selectedSize) {
      this.showToast('Por favor, selecciona una talla antes de agregar al carrito.');
      return;
    }

    if (this.selectedQuantity <= 0) {
      this.showToast('La cantidad debe ser al menos 1.');
      return;
    }

    if (this.productoDetalle) {
      try {
        const idcart = await this.getOrCreateCart();
        const existingCartItem = await this.serviceBD.getCartItem(idcart, this.productoDetalle.idproduct, this.selectedSize);
        let totalQuantity = this.selectedQuantity;
        if (existingCartItem) {
          totalQuantity += existingCartItem.quantity;
        }
        if (totalQuantity > this.productoDetalle.stockproduct) {
          this.showToast('No puedes agregar más de la cantidad disponible en stock.');
          return;
        }

        // Insertar o actualizar el producto en el carrito
        if (existingCartItem) {
          await this.serviceBD.updateCartItemQuantity(idcart, this.productoDetalle.idproduct, this.selectedSize, totalQuantity);
        } else {
          await this.serviceBD.insertCartItem(idcart, this.productoDetalle.idproduct, this.selectedSize, this.selectedQuantity);
        }

        this.showToast('Producto agregado al carrito: ' + this.productoDetalle.nameproduct);
      } catch (error) {
        this.showToast('Error al agregar el producto al carrito: ' + error);
        console.error('Error al agregar el producto al carrito:', error);
      }
    } else {
      console.log('hay algún error en productoDetalle');
    }
  }

  async toggleFavorite(producto: Productos & { isFavorite: boolean }) {
    if (producto.isFavorite) {
      try {
        await this.serviceBD.deleteFavoriteItem(this.idlist, producto.idproduct);
        producto.isFavorite = false;
      } catch (error) {
        console.error('Error al eliminar el producto de favoritos:', error);
      }
    } else {
      try {
        await this.serviceBD.addFavoriteItem(this.idlist, producto.idproduct);
        producto.isFavorite = true;
      } catch (error) {
        console.error('Error al agregar el producto a favoritos:', error);
      }
    }
  }
  showToast(message: string) {
    this.toastMessage = message;
    this.isToastOpen = true;
  }
}
