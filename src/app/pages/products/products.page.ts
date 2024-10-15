import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, NavigationExtras, Router } from '@angular/router';
import { MenuController } from '@ionic/angular';
import { filter } from 'rxjs/operators';
import { Productos } from 'src/app/services/productos';
import { ServiceBDService } from 'src/app/services/service-bd.service';

@Component({
  selector: 'app-products',
  templateUrl: './products.page.html',
  styleUrls: ['./products.page.scss'],
})
export class ProductsPage implements OnInit {
  products: Productos[] = [];
  filteredProducts: Productos[] = [];
  priceRange: number = 10000;
  selectedCategory: number = 0;
  selectedGender: number = 0;
  brandsAvailable: any[] = [];
  categoriesAvailable: any[] = [];
  genderAvailable: any[] = [];
  noFilteredResults: boolean = false;

  constructor(
    private router: Router,
    private activatedroute: ActivatedRoute,
    private menucontroller: MenuController,
    private serviceBD: ServiceBDService
  ) {
    this.activatedroute.queryParams.subscribe(param => {
      if (this.router.getCurrentNavigation()?.extras.state) {
        // Manejar el estado adicional si es necesario
      }
    });
  }

  ngOnInit() {
    this.verificarConexionBD();
  }

  verificarConexionBD() {
    this.serviceBD.dbReady()
      .pipe(filter(isReady => isReady))
      .subscribe(() => {
        this.serviceBD.fetchProducts().subscribe((data: Productos[]) => {
          this.products = data;
          this.filteredProducts = data;
        });
        this.serviceBD.searchProducts();
        this.selectDataStatic();
      });
  }

  // Método para aplicar filtros
  applyFilters() {
    this.filteredProducts = this.products.filter(product => {
      const matchPrice = product.priceproduct <= this.priceRange;
      const matchCategory = this.selectedCategory ? product.idcategory === this.selectedCategory : true;
      const matchGender = this.selectedGender ? product.idgender === this.selectedGender : true;
      return matchPrice && matchCategory && matchGender;
    });

    this.noFilteredResults = this.filteredProducts.length === 0;
    if (this.noFilteredResults) {
      this.filteredProducts = this.products;
      this.serviceBD.presentAlert('Filtro','No se ha encontrado ningun producto con el filtro seleccionado');
    }
  }
  clearFilters() {
    this.selectedCategory = 0;
    this.selectedGender = 0;
    this.priceRange = 10000;
    this.filteredProducts = this.products;
    this.noFilteredResults = false;
  }
  selectDataStatic() {
    this.serviceBD.fetchCategories().then(data => {
      this.categoriesAvailable = data || [];
    }).catch(e => {
      this.serviceBD.presentAlert('Error', 'Error obteniendo las categorías: ' + JSON.stringify(e));
    });
    this.serviceBD.fetchGenders().then(data => {
      this.genderAvailable = data || [];
    }).catch(e => {
      this.serviceBD.presentAlert('Error', 'Error obteniendo los géneros: ' + JSON.stringify(e));
    });
  }

  irPagina(ruta: string) {
    this.router.navigate([ruta]);
  }

  modificarProducto(productId: number) {
    const navigationExtras: NavigationExtras = {
      state: { id: productId }
    };
    this.router.navigate([`/product-detail`, productId], navigationExtras);
  }

  abrirFiltroMenu() {
    this.menucontroller.open('filterMenu');
  }
}
