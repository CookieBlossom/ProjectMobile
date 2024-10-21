import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Productos } from 'src/app/services/productos';
import { ServiceBDService } from 'src/app/services/service-bd.service';
import { UserSessionService } from 'src/app/services/user-session.service';

@Component({
  selector: 'app-product-detail',
  templateUrl: './product-detail.page.html',
  styleUrls: ['./product-detail.page.scss'],
})
export class ProductDetailPage implements OnInit {
  productId: any;
  productoDetalle: (Productos & { isFavorite: boolean }) | null = null;
  productSizes: any[] = [];
  selectedSize: number | null = null;
  selectedQuantity: number = 1;
  maxQuantity: number = 0;
  isToastOpen = false;
  toastMessage: string = '';
  sizesAvailable: any[] = [];

  // idlist siempre será 1
  idlist: number = 1;

  constructor(
    private activatedroute: ActivatedRoute,
    private router: Router,
    private serviceBD: ServiceBDService,
    private serviceSession: UserSessionService
  ) {
    const navigation = this.router.getCurrentNavigation();
    if (navigation && navigation.extras && navigation.extras.state) {
      this.productId = navigation.extras.state['id']; // Aquí obtienes el ID
    } else {
      console.error('Error: No se pudo obtener el productId de la navegación.');
    }
  }

  ngOnInit() {
    this.serviceSession.getUserSession().subscribe(user => {
      if (user) {
        console.log('Sesión de usuario:', user);
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
  }

  cargarProducto(id: number) {
    this.serviceBD.getProductById(id).then(async (product: Productos | null) => {
      if (product) {
        const isFavorite = await this.serviceBD.isProductInFavorites(this.idlist, product.idproduct);
        this.productoDetalle = {
          ...product,
          isFavorite: isFavorite // Se agrega la propiedad isFavorite
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
        console.log('Tallas con namesizes agregados:', this.productSizes);
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
    console.log('Tamaño seleccionado:', size);
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

  async toggleFavorite(producto: Productos & { isFavorite: boolean }) {
    if (producto) {
      if (producto.isFavorite) {
        try {
          await this.serviceBD.deleteFavoriteItem(this.idlist, producto.idproduct); // Usar idlist = 1
          producto.isFavorite = false; // Actualiza la UI
          console.log('Producto eliminado de favoritos');
        } catch (error) {
          console.error('Error al eliminar el producto de favoritos:', error);
        }
      } else {
        try {
          await this.serviceBD.addFavoriteItem(this.idlist, producto.idproduct); // Usar idlist = 1
          producto.isFavorite = true; // Actualiza la UI
          console.log('Producto agregado a favoritos');
        } catch (error) {
          console.error('Error al agregar el producto a favoritos:', error);
        }
      }
    }
  }

  addToCart() {
    if (this.productoDetalle) {
      this.showToast('Producto agregado al carrito: ' + this.productoDetalle.nameproduct);
    }
  }

  showToast(message: string) {
    this.toastMessage = message;
    this.isToastOpen = true;
  }
}
