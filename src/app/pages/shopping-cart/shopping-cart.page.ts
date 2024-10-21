import { Component, OnInit } from "@angular/core";
import { Router } from "@angular/router";
import { ServiceBDService } from "src/app/services/service-bd.service";
import { UserSessionService } from "src/app/services/user-session.service";
import { Users } from "src/app/services/users";
import { CartItem } from "src/app/services/cart-item";
import { Productos } from "src/app/services/productos";
import { ShoppingCart } from "src/app/services/shopping-cart";
import { filter } from "rxjs/operators";

type ProductWithQuantity = Productos & { quantity: number; selected?: boolean };

@Component({
  selector: 'app-shopping-cart',
  templateUrl: './shopping-cart.page.html',
  styleUrls: ['./shopping-cart.page.scss'],
})
export class ShoppingCartPage implements OnInit {
  productsInCart: ProductWithQuantity[] = [];
  user: Users | null = null;
  cartItem: CartItem[] = [];
  shoppingCart: ShoppingCart | null = null;
  selectedProducts: Set<number> = new Set();  // Para almacenar los idproduct seleccionados
  toastMessage: string | undefined;
  isToastOpen: boolean = false;

  constructor(private router: Router, private serviceBD: ServiceBDService, private serviceSession: UserSessionService) {}

  ngOnInit() {
    this.verificarConexionBD();
  }

  verificarConexionBD() {
    this.serviceBD.dbReady()
      .pipe(filter(isReady => isReady))
      .subscribe(() => {
        this.serviceSession.getUserSession().subscribe(user => {
          if (user) {
            this.user = user;
            this.checkShoppingCart(user.rut);
            console.log("hola");
          }
        });
      });
  }

  async checkShoppingCart(rut: string) {
    console.log("hola2");
    try {
      console.log("hola3");
      this.shoppingCart = await this.serviceBD.getShoppingCartByRut(rut);
      console.log("hol4");
      if (!this.shoppingCart) {
        const newCartId = await this.serviceBD.createNewCart(rut);
        this.shoppingCart = await this.serviceBD.getShoppingCartById(newCartId);
      }
      this.serviceBD.fetchCartItems().subscribe(cartItems => {
        this.cartItem = cartItems;
        console.log("hola5");
        this.cargarProductosEnCarrito();
      });
    } catch (error) {
      console.error('Error al verificar o crear el carrito:', error);
    }
  }
  cargarProductosEnCarrito() {
    console.log("hola6");
    if (this.shoppingCart) {
      console.log("hola7");
      this.serviceBD.getCartItemsByCartId(this.shoppingCart.idcart).then((cartItems) => {
        console.log("hol8");
        this.cartItem = cartItems;
        this.serviceBD.fetchProducts().subscribe((data: Productos[]) => {
          this.productsInCart = data
            .filter(product => this.cartItem.some(cart => cart.idproduct === product.idproduct))
            .map(product => {
              const cartItem = this.cartItem.find(cart => cart.idproduct === product.idproduct);
              return {
                ...product,
                quantity: cartItem ? cartItem.quantity : 1,
                selected: this.selectedProducts.has(product.idproduct)
              } as ProductWithQuantity;
            });
        });
      }).catch(error => {
        console.error('Error al obtener los ítems del carrito:', error);
      });
    }
  }

  async comprar() {
    console.log("Entrando a la función comprar");
    if (this.productsInCart.length > 0 && this.shoppingCart && this.user) {
      console.log("Hay productos en el carrito, carrito y usuario disponibles");
      try {
        for (let product of this.productsInCart) {
          const totalorder = product.priceproduct * product.quantity;
          console.log("Procesando producto:", product);
          const idorder = await this.serviceBD.insertOrder(totalorder, product.idproduct, 1, this.user.rut);
          await this.serviceBD.insertOrderHistory(idorder, this.user.rut, 1);
          const cartItem = this.cartItem.find(cart => cart.idproduct === product.idproduct);
          if (cartItem) {
            await this.serviceBD.deleteCartItem(cartItem.idcart_item);
          }
        }
        this.cargarProductosEnCarrito();
        this.showToast('Compra realizada con éxito');
      } catch (error) {
        console.log("Error durante la compra:", error);
        this.showToast('Error al realizar la compra: ' + error);
      }
    } else {
      console.log("No hay productos en el carrito para comprar");
      this.showToast('No hay productos en el carrito para comprar.');
    }
  }


  showToast(message: string) {
    this.toastMessage = message;
    this.isToastOpen = true;
  }

  irPagina(ruta: string) {
    this.router.navigate([ruta]);
  }
}
