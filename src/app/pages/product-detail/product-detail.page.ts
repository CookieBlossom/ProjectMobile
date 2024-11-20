import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { filter } from 'rxjs/operators';
import { Productos } from 'src/app/services/productos';
import { ServiceBDService } from 'src/app/services/service-bd.service';
import { ShoppingCart } from 'src/app/services/shopping-cart';
import { UserSessionService } from 'src/app/services/user-session.service';
import { ChangeDetectorRef } from '@angular/core';
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
  idlist!: number;

  constructor(
    private activatedroute: ActivatedRoute,
    private router: Router,
    private serviceBD: ServiceBDService,
    private serviceSession: UserSessionService,
    private cdr: ChangeDetectorRef,
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
        this.serviceSession.getUserSession().subscribe(async user => {
          if (user) {
            const cart = await this.serviceBD.getShoppingCartByRut(user.rut);
            this.shoppingCart = cart ? cart : null;
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
    this.serviceSession.getUserSession().subscribe(async (user) => {
      if (user) {
        try {
          const favoriteList = await this.getOrCreateFavoriteList(user.rut);
          if (favoriteList && favoriteList.idlist) {
            this.idlist = favoriteList.idlist; // Asignar el idlist correcto
            console.log('Lista de favoritos obtenida:', this.idlist);
            this.serviceBD.getProductById(id).then(async (product: Productos | null) => {
              if (product) {
                // Verificar si el producto es favorito
                const isFavorite = await this.serviceBD.isProductInFavorites(this.idlist, product.idproduct);
                console.log('¿Es favorito?', isFavorite);

                // Asignar detalles del producto
                this.productoDetalle = { ...product, isFavorite };
                this.maxQuantity = this.productoDetalle.stockproduct;
                this.cargarTallasProducto(id);
              } else {
                console.error('Producto no encontrado');
              }
            }).catch(error => {
              console.error('Error al cargar el producto:', error);
            });
          } else {
            console.error('No se pudo obtener o crear la lista de favoritos.');
          }
        } catch (error) {
          console.error('Error al cargar la lista de favoritos:', error);
        }
      } else {
        console.error('No se encontró una sesión de usuario activa.');
      }
    });
  }


  cargarTallasProducto(idproduct: number) {
    this.serviceBD.fetchProductSizesByProductId(idproduct).then(sizes => {
      this.serviceBD.fetchSizes().then(allSizes => {
        this.productSizes = sizes.map(ps => {
          const matchedSize = allSizes.find(size => size.idsize === ps.idsize);
          return { ...ps, namesizes: matchedSize ? matchedSize.size : null };
        });
      });
    }).catch(error => {
      console.error('Error al cargar las tallas del producto:', error);
    });
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

  async getOrCreateCart(): Promise<number> {
    return new Promise((resolve, reject) => {
      this.serviceSession.getUserSession().subscribe(async user => {
        if (user) {
          try {
            if (!this.shoppingCart) {
              const cart = await this.serviceBD.getShoppingCartByRut(user.rut);
              if (cart) {
                this.shoppingCart = cart;
                resolve(this.shoppingCart.idcart);
              } else {
                const newCartId = await this.serviceBD.createNewCart(user.rut);
                this.shoppingCart = { idcart: newCartId, rut: user.rut };
                resolve(newCartId);
              }
            } else {
              resolve(this.shoppingCart.idcart);
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
        const existingCartItem = await this.serviceBD.getCartItem(idcart, this.productoDetalle.idproduct, this.selectedSize); // Verificar si ya existe el producto en el carrito
        let totalQuantity = this.selectedQuantity;
        if (existingCartItem) {
          totalQuantity += existingCartItem.quantity;
          if (totalQuantity > this.productoDetalle.stockproduct) {
            this.showToast('No puedes agregar más de la cantidad disponible en stock.');
            return;
          }
          await this.serviceBD.updateCartItemQuantityWithSize(idcart, this.productoDetalle.idproduct, this.selectedSize, totalQuantity);
        } else {
          await this.serviceBD.insertCartItem(idcart, this.productoDetalle.idproduct, this.selectedSize, this.selectedQuantity);
        }

        this.showToast('Producto agregado al carrito: ' + this.productoDetalle.nameproduct);
      } catch (error) {
        this.showToast('Error al agregar el producto al carrito: ' + error);
        console.error('Error al agregar el producto al carrito:', error);
      }
    }
  }
  async getOrCreateFavoriteList(rut: string): Promise<{ idlist: number } | null> {
    try {
      const favoriteList = await this.serviceBD.getFavoriteListByRutAndName(rut, 'Todos');
      if (favoriteList) {
        return { idlist: favoriteList.idlist }; // Siempre devuelve solo el idlist
      }

      const newListId = await this.serviceBD.createFavoriteList(rut, 'Todos');
      if (newListId) {
        console.log('Lista "Todos" creada para el usuario:', rut);
        return { idlist: newListId };
      }

      return null; // Si no se pudo crear la lista
    } catch (error) {
      console.error('Error al obtener o crear la lista de favoritos:', error);
      return null;
    }
  }

  async toggleFavorite(producto: Productos & { isFavorite: boolean }) {
    console.log('toggleFavorite llamado:', producto);
    this.serviceSession.getUserSession().subscribe(async (user) => {
      if (user) {
        try {
          const favoriteList = await this.getOrCreateFavoriteList(user.rut);
          if (!favoriteList) {
            console.error('No se pudo obtener o crear la lista de favoritos.');
            return;
          }
          // Determinar si agregar o eliminar el producto
          if (producto.isFavorite) {
            await this.serviceBD.deleteFavoriteItem(favoriteList.idlist, producto.idproduct);
            producto.isFavorite = false;
            console.log('Producto eliminado de favoritos:', producto.idproduct);
          } else {
            await this.serviceBD.addFavoriteItem(favoriteList.idlist, producto.idproduct);
            producto.isFavorite = true;
            console.log('Producto agregado a favoritos:', producto.idproduct);
          }

          this.cdr.detectChanges();
          console.log('Estado actualizado:', producto.isFavorite);

        } catch (error) {
          console.error('Error en toggleFavorite:', error);
        }
      } else {
        console.error('No se encontró una sesión de usuario activa.');
      }
    });
  }


  showToast(message: string) {
    this.toastMessage = message;
    this.isToastOpen = true;
  }
  irPagina( ruta:string ){
    this.router.navigate([ruta]);
  }
}
