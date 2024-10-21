import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Productos } from 'src/app/services/productos';
import { ServiceBDService } from 'src/app/services/service-bd.service';
import { filter } from 'rxjs/operators';
import { NavigationExtras, Router } from '@angular/router';
import { MenuController } from '@ionic/angular';
@Component({
  selector: 'app-products',
  templateUrl: './products.page.html',
  styleUrls: ['./products.page.scss'],
})
export class ProductsPage implements OnInit {
  filtersForm: FormGroup;
  products: Productos[] = [];
  filteredProducts: Productos[] = [];
  isLoading: boolean = true;

  categoriesAvailable: any[] = [];
  genderAvailable: any[] = [];

  constructor(private fb: FormBuilder, private serviceBD: ServiceBDService, private router:Router, private menucontroller: MenuController) {
    this.filtersForm = this.fb.group({
      priceRange: [10000],
      selectedCategory: [0],
      selectedGender: [0]
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
          this.isLoading = false;
        });
        this.serviceBD.searchProducts();
        this.selectDataStatic();
      });
  }
  applyFilters() {
    const { priceRange, selectedCategory, selectedGender } = this.filtersForm.value;

    this.filteredProducts = this.products.filter(product => {
      const matchPrice = product.priceproduct <= priceRange;
      const matchCategory = selectedCategory ? product.idcategory === selectedCategory : true;
      const matchGender = selectedGender ? product.idgender === selectedGender : true;
      return matchPrice && matchCategory && matchGender;
    });
  }
  clearFilters() {
    this.filtersForm.reset({ priceRange: 10000, selectedCategory: 0, selectedGender: 0 });
    this.filteredProducts = this.products;
  }

  selectDataStatic() {
    this.serviceBD.fetchCategories().then(data => {
      this.categoriesAvailable = data || [];
    }).catch(e => {
      console.error('Error obteniendo categorías', e);
    });
    this.serviceBD.fetchGenders().then(data => {
      this.genderAvailable = data || [];
    }).catch(e => {
      console.error('Error obteniendo géneros', e);
    });
  }
  irPagina(ruta:string) {
    this.router.navigate([ruta]);
  }
  abrirFiltroMenu() {
    this.menucontroller.open('filterMenu');
  }
  modificarProducto(productId: number) {
    const navigationExtras: NavigationExtras = {
      state: { id: productId }
    };
    this.router.navigate([`/product-detail`, productId], navigationExtras);
  }
}
