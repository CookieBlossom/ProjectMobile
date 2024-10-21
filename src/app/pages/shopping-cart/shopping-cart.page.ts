import { Component, OnInit } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { filter } from "rxjs/operators";
import { CartItem } from "src/app/services/cart-item";
import { Productos } from "src/app/services/productos";
import { ServiceBDService } from "src/app/services/service-bd.service";
import { ShoppingCart } from "src/app/services/shopping-cart";
import { UserSessionService } from "src/app/services/user-session.service";
import { Users } from "src/app/services/users";
@Component({
  selector: 'app-shopping-cart',
  templateUrl: './shopping-cart.page.html',
  styleUrls: ['./shopping-cart.page.scss'],
})
export class ShoppingCartPage implements OnInit {
  products: Productos[] = [];
  productsInCart: Productos[] = [];
  user: Users | null = null;
  cartItem: CartItem[] = [];
  shoppingCart: ShoppingCart | null = null;
  isToastOpen = false;
  selectedProducts = new Set<number>();
  toastMessage: string = '';
  constructor(private activatedroute: ActivatedRoute,private router: Router,private serviceBD: ServiceBDService,private serviceSession: UserSessionService) {}
  ngOnInit() {
    this.verificarConexionBD();
  }
  verificarConexionBD() {
    this.serviceBD.dbReady()
      .pipe(filter(isReady => isReady))
      .subscribe(() => {
        this.serviceBD.fetchProducts().subscribe((data: Productos[]) => {
          this.products = data;
        });
        this.serviceBD.searchCartItems();
        this.serviceBD.searchShoppingCarts();
        this.serviceBD.searchProducts();
        this.obtenerSesionUsuario();
        this.serviceBD.searchUsers();
      });
  }
  obtenerSesionUsuario() {
    this.serviceSession.getUserSession().subscribe(user => {
      if (user) {
        this.user = user;
        console.log('Rut del usuario recuperado:', this.user?.rut);
        this.checkShoppingCart(this.user.rut);
      } else {
        console.error('No se encontró una sesión de usuario activa.');
      }
    });
  }
  async checkShoppingCart(rut: string) {
    if (this.user) {
      this.shoppingCart = await this.serviceBD.getShoppingCartByRut(rut);
      if (!this.shoppingCart) {
        const newCartId = await this.serviceBD.createNewCart(rut);
        console.log('Nuevo carrito creado con ID:', newCartId);
        this.shoppingCart = await this.serviceBD.getShoppingCartById(newCartId);
      } else {
        console.log('Carrito de compras existente:', this.shoppingCart);
      }
      await this.cargarCartItems();
    }
  }
  async cargarCartItems() {
    if (this.shoppingCart) {
      this.cartItem = await this.serviceBD.getCartItemsByCartId(this.shoppingCart.idcart);
      this.productsInCart = this.products.filter(product =>
        this.cartItem.some(cart => cart.idproduct === product.idproduct)
      );
    }
  }
  filterProductsInCart() {
    const productsInCart = this.products.filter(product =>
      this.cartItem.some(cart => cart.idproduct == product.idproduct)
    );
    return productsInCart;
  }
  irPagina(ruta:string){
    this.router.navigate([ruta]);
  }
  increaseQuantity(product: any) {
    if (product.quantity < product.stock) {
      product.quantity++;
    }
  }
  decreaseQuantity(product: any) {
    if (product.quantity > 1) {
      product.quantity--;
    }
  }
  onCheckboxChange(event: any, product: any) {
    if (event.detail.checked) {
      this.selectedProducts.add(product.id);
    } else {
      this.selectedProducts.delete(product.id);
    }
  }
  comprar() {
    if (this.selectedProducts.size > 0) {
      this.showToast('Compra realizada con éxito');
    } else {
      this.showToast('Necesita seleccionar al menos 1 producto para continuar');
    }
  }
  showToast(message: string) {
    this.toastMessage = message;
    this.isToastOpen = true;
  }
}
