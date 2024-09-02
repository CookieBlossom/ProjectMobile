import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, NavigationExtras, Router } from '@angular/router';

@Component({
  selector: 'app-product-detail',
  templateUrl: './product-detail.page.html',
  styleUrls: ['./product-detail.page.scss'],
})
export class ProductDetailPage implements OnInit {
  productId: any;
  Productos: any;
  productoDetalle: any;
  selectedSize: string | null = null;
  selectedQuantity: number = 1;
  maxQuantity: number = 0;
  isToastOpen=false;
  toastMessage: string = '';
  constructor(private activatedroute:ActivatedRoute, private router:Router){
    if(this.router.getCurrentNavigation()?.extras.state){
      this.productId = this.activatedroute.snapshot.paramMap.get('id');
      this.Productos = this.router.getCurrentNavigation()?.extras?.state?.['productos'];
      console.log(this.productId);    
      console.log(this.Productos);
    }
  
  } 
  ngOnInit() {
    this.verDetalle();
  }
  irPagina( ruta:string ){
    let navigationextras:NavigationExtras = {
      state:{
        productos: this.Productos,
      }
    }
    this.router.navigate([ruta], navigationextras);
  }
  verDetalle(){
    this.productoDetalle = this.Productos.find((producto: any) => producto.id == this.productId);
    if(this.productoDetalle){
      console.log('producto encontrao de pana', this.productoDetalle);
    } else {
      console.log('hay un error papito');
    }
    this.maxQuantity = this.productoDetalle.stock;
  }
  selectSize(size: string) {
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
  toggleFavorite(productoDetalle: any) {
    this.productoDetalle.isFavorite = !this.productoDetalle.isFavorite;
  }
  addToCart() {
    this.showToast('Producto agregado al carrito: ' + this.productoDetalle.name);
  }

  showToast(message: string) {
    this.toastMessage = message;
    this.isToastOpen = true;
  }
}
