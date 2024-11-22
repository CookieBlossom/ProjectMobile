import { Component, OnInit } from "@angular/core";
import { Router } from "@angular/router";
import { ServiceBDService } from "src/app/services/service-bd.service";
import { UserSessionService } from "src/app/services/user-session.service";
import { Users } from "src/app/services/users";
import { CartItem } from "src/app/services/cart-item";
import { Productos } from "src/app/services/productos";
import { ShoppingCart } from "src/app/services/shopping-cart";
import { filter } from "rxjs/operators";

type ProductWithQuantity = Productos & { quantity: number; selected?: boolean; size: number };

@Component({
  selector: 'app-shopping-cart',
  templateUrl: './shopping-cart.page.html',
  styleUrls: ['./shopping-cart.page.scss'],
})
export class ShoppingCartPage implements OnInit {
  productsInCart: ProductWithQuantity[] = [];
  products: Productos[] = []
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
        this.serviceBD.searchProducts();
        this.serviceBD.fetchProducts().subscribe((data: Productos[]) => {
          this.products = data;
          console.log("Productos cargados", JSON.stringify(this.products));
        });
        this.serviceSession.getUserSession().subscribe(user => {
          if (user) {
            this.user = user;
            this.checkShoppingCart(user.rut);
          }
        });
      });
  }

  async checkShoppingCart(rut: string) {
    try {
      this.shoppingCart = await this.serviceBD.getShoppingCartByRut(rut);
      if (!this.shoppingCart) {
        const newCartId = await this.serviceBD.createNewCart(rut);
        this.shoppingCart = await this.serviceBD.getShoppingCartById(newCartId);
      }
      this.serviceBD.fetchCartItems().subscribe(cartItems => {
        this.cartItem = cartItems;
        this.cargarProductosEnCarrito();
      });
    } catch (error) {
      console.error('Error al verificar o crear el carrito:', error);
    }
  }
  cargarProductosEnCarrito() {
    if (this.shoppingCart) {
      console.log("Cargando productos para carrito ID:", this.shoppingCart.idcart);

      this.serviceBD.getCartItemsByCartId(this.shoppingCart.idcart).then((cartItems) => {
        this.cartItem = cartItems;
        console.log("Ítems del carrito obtenidos:", JSON.stringify(this.cartItem));
        this.serviceBD.fetchProducts().subscribe((data: Productos[]) => {
          console.log("Productos disponibles:", JSON.stringify(data));
          this.productsInCart = cartItems.map(cartItem => {
            const product = data.find(product => product.idproduct === cartItem.idproduct);
            if (product) {
              return {
                ...product,
                quantity: cartItem.quantity,
                size: cartItem.size,
                selected: this.selectedProducts.has(cartItem.idproduct),
              } as ProductWithQuantity;
            }
            return null;
          })
          .filter(product => product !== null) as ProductWithQuantity[];

          console.log("Productos en el carrito:", JSON.stringify(this.productsInCart));
        });
      }).catch(error => {
        console.error('Error al obtener los ítems del carrito:', error);
      });
    } else {
      console.warn("No hay un carrito activo para cargar productos.");
    }
  }

  async comprarTest() {
    console.log("Estado inicial:", JSON.stringify({
      productsInCart: this.productsInCart,
      shoppingCart: this.shoppingCart,
      user: this.user
    }));
    try {
      for (let product of this.productsInCart) {
        const totalorder = product.priceproduct * product.quantity;
        console.log("Procesando producto:", JSON.stringify(product));
        const idorder = await this.serviceBD.insertOrder(totalorder, product.idproduct, this.user?.rut || '', product.quantity);
        await this.serviceBD.insertOrderHistory(idorder || 0, this.user?.rut || '', 1);
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
    if (this.productsInCart.length > 0 && this.shoppingCart && this.user) {
      console.log("Hay productos en el carrito, carrito y usuario disponibles");
    } else {
      console.log("No se cumplen las condiciones para comprar.");
      this.showToast('No hay productos en el carrito o falta información del carrito o usuario.');
      return;
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
