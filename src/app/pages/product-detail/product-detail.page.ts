import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, NavigationExtras, Router } from '@angular/router';
import { ProductSizes } from 'src/app/services/product-sizes';
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
  productoDetalle: Productos | null = null;
  productSizes: any[] = [];
  selectedSize: number | null = null;
  selectedQuantity: number = 1;
  maxQuantity: number = 0;
  isToastOpen = false;
  toastMessage: string = '';
  sizesAvailable: any[] = [];

  constructor(private activatedroute: ActivatedRoute, private router: Router, private serviceBD: ServiceBDService, private serviceSession: UserSessionService) {
    const navigation = this.router.getCurrentNavigation();
    if (navigation && navigation.extras && navigation.extras.state) {
      this.productId = navigation.extras.state['id']; // Aquí obtienes el ID
    } else {
      console.error('Error: No se pudo obtener el productId de la navegación.');
    }
  }
  ngOnInit() {
    this.serviceSession.getUserSession().subscribe(user => {
      if (user) {console.log('Sesión de usuario:', user);
      } else {console.error('No se encontró una sesión de usuario activa.');}
    });
    this.activatedroute.params.subscribe(params => {
      this.productId = params['id'];
      if (this.productId) {this.cargarProducto(this.productId);}
      else {console.error('No se pudo cargar el detalle del producto porque no se encontró productId.');}
    });
  }
  cargarProducto(id: number) {
    this.serviceBD.getProductById(id).then((product: Productos | null) => {
      if (product) {
        this.productoDetalle = product;
        this.maxQuantity = product.stockproduct;
        this.cargarTallasProducto(id);
      } else {
        console.error('Producto no encontrado');
      }
    }).catch(error => {
      console.error('Error al cargar el producto:', error);
    });
  }

  cargarTallasProducto(idproduct: number) {
    this.serviceBD.fetchProductSizesByProductId(idproduct).then((sizes: any[]) => {  // Usar `any[]`
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
  // toggleFavorite() {
  //   if (this.productoDetalle) {
  //     this.productoDetalle.isFavorite = !this.productoDetalle.isFavorite;
  //   }
  // }
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
