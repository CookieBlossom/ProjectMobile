import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, NavigationExtras, Router } from '@angular/router';

@Component({
  selector: 'app-shopping-cart',
  templateUrl: './shopping-cart.page.html',
  styleUrls: ['./shopping-cart.page.scss'],
})
export class ShoppingCartPage implements OnInit {
  Productos: any;
  Usuarios: any;
  selectedQuantity: number = 1;
  maxQuantity: number = 12;
  isToastOpen = false;
  selectedProducts = new Set<number>();
  toastMessage: string = '';
  constructor(private activatedroute:ActivatedRoute, private router:Router){
    if(this.router.getCurrentNavigation()?.extras.state){
      this.Productos = this.router.getCurrentNavigation()?.extras?.state?.['productos'];
      this.Productos.forEach((product: { quantity: number; }) => {
        if (!product.quantity) {
          product.quantity = 1;
        }
      });

    }
  
  } 
  ngOnInit() {
  }
  irPagina( ruta:string ){
    let navigationextras:NavigationExtras = {
      state:{
        productos: this.Productos,
      }
    }
    this.router.navigate([ruta], navigationextras);
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
    this.isToastOpen = true; // Abre el toast
  }
}
