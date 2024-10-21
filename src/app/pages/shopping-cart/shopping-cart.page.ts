import { Component, OnInit } from "@angular/core";
import { Router } from "@angular/router";
import { ServiceBDService } from "src/app/services/service-bd.service";
import { UserSessionService } from "src/app/services/user-session.service";
import { Users } from "src/app/services/users";
import { CartItem } from "src/app/services/cart-item";
import { Productos } from "src/app/services/productos";
import { ShoppingCart } from "src/app/services/shopping-cart";
import { filter } from "rxjs/operators";

type ProductWithQuantity = Productos & { quantity: number };

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
  productList: Productos[] = [];

  constructor(private router: Router, private serviceBD: ServiceBDService, private serviceSession: UserSessionService) {}

  ngOnInit() {
    console.log('estoy en carrito compras');
    this.verificarConexionBD();
  }

  verificarConexionBD() {
    this.serviceBD.dbReady()
      .pipe(filter(isReady => isReady))
      .subscribe(() => {
        this.serviceSession.getUserSession().subscribe(user => {
          if (user) {
            this.user = user;
            console.log('Tengo al usuario ' + user.rut);
            this.checkShoppingCart(user.rut);
          } else {
            console.error('No se encontró una sesión de usuario activa.');
          }
        });
      });
  }
  async checkShoppingCart(rut: string) {
    try {
      this.shoppingCart = await this.serviceBD.getShoppingCartByRut(rut);
      console.log('Tengo el carrito'+ this.shoppingCart);
      if (!this.shoppingCart) {
        const newCartId = await this.serviceBD.createNewCart(rut);
        this.shoppingCart = await this.serviceBD.getShoppingCartById(newCartId);
      }
      // Nos suscribimos a los cambios en los ítems del carrito
      this.serviceBD.fetchCartItems().subscribe(cartItems => {
        console.log('Tengo los cartItems' + cartItems);
        this.cartItem = cartItems;
        this.cargarProductosEnCarrito();
      });
    } catch (error) {
      console.error('Error al verificar o crear el carrito:', error);
    }
  }

  cargarProductosEnCarrito() {
    console.log('sigo teniendo el carrito ' + this.shoppingCart);
    if (this.shoppingCart) {
      console.log('voy a traerme los productos del carrito ' + this.shoppingCart.idcart);
      this.serviceBD.getCartItemsByCartId(this.shoppingCart.idcart).then((cartItems) => {
        this.cartItem = cartItems;
        console.log('Items del carrito para el idcart: ', this.cartItem);
        this.serviceBD.fetchProducts().subscribe(
          (data: Productos[]) => {
            this.productList = data;
            console.log('Productos obtenidos:', this.productList);
            if (this.productList.length === 0) {
              console.log('No se han encontrado productos en la base de datos.');
            }
            if (this.cartItem.length === 0) {
              console.log('No se han encontrado ítems en el carrito.');
            }
            this.productsInCart = this.productList
              .filter(product => this.cartItem.some(cart => cart.idproduct === product.idproduct))
              .map(product => {
                const cartItem = this.cartItem.find(cart => cart.idproduct === product.idproduct);
                console.log('Producto encontrado en el carrito:', product, 'Cantidad:', cartItem?.quantity);
                return {
                  ...product,
                  quantity: cartItem ? cartItem.quantity : 1
                } as ProductWithQuantity;
              });

            console.log('Productos cargados en el carrito:', this.productsInCart);
          },
          (error) => {
            console.error('Error al cargar productos en el carrito:', error);
          }
        );
      }).catch(error => {
        console.error('Error al obtener los ítems del carrito:', error);
      });
    }
  }


  irPagina(ruta:string) {
    this.router.navigate([ruta]);
  }
}
