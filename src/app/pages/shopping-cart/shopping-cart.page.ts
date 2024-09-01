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
      console.log(this.Productos);
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
