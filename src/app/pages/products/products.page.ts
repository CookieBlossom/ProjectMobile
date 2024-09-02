import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, NavigationExtras, Router } from '@angular/router';
import { MenuController } from '@ionic/angular';
@Component({
  selector: 'app-products',
  templateUrl: './products.page.html',
  styleUrls: ['./products.page.scss'],
})
export class ProductsPage implements OnInit {
  Productos: any;
  priceRange: number = 10000;
  selectedCategory: string = '';
  selectedGender: string = '';
  constructor( private router:Router, private activatedroute:ActivatedRoute, private menucontroller:MenuController) {
    this.activatedroute.queryParams.subscribe( param => {
      if(this.router.getCurrentNavigation()?.extras.state){
        this.Productos = this.router.getCurrentNavigation()?.extras?.state?.['productos'];
      }
    })
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
  abrirFiltroMenu(){
    this.menucontroller.enable(true, 'filterMenu');
    this.menucontroller.open('filterMenu');
  }

  verDetalleProducto(productId: number) {
    const navigationExtras: NavigationExtras = {
      state: { 
        productos: this.Productos,
      }
    };

    // Navegar a la ruta con el parámetro de ID
    this.router.navigate(['/product-detail', productId], navigationExtras);
  }
  toggleFavorite(product: any) {
    product.isFavorite = !product.isFavorite;
  }
  applyFilters() {
    if (!this.selectedCategory && !this.selectedGender && this.priceRange === 10000) {
      alert('Debe seleccionar al menos un filtro para aplicar.');
      return;
    }
    console.log('Filtros aplicados:', {
      priceRange: this.priceRange,
      category: this.selectedCategory,
      gender: this.selectedGender
    });
  }
}
